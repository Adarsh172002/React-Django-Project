from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

#-------------------------------------------------------------
#LOGIN_VIEWS


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




#-----------------------------------------------------------\
#USER_DETAIL_VIEWS


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        return Response(data)
    
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

#-------------------------------------------------------------
# SocialMediaPost_Views

class SocialMediaPostListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        posts = SocialMediaPost.objects.all()
        serializer = SocialMediaPostSerializer(posts, many=True)
        data = serializer.data
        for item in data:
            image_path = item.get('image')
            user_id = item.get('user')
            if user_id:
                try:
                    user = CustomUser.objects.get(id=user_id)
                    user_serializer = UserSerializer(user)
                    item['user_details'] = user_serializer.data
                except CustomUser.DoesNotExist:
                    item['user_details'] = None
            else:
                item['user_details'] = None
                
            post_id = item.get('id')
            if post_id:
                comments = Comment.objects.filter(post=post_id)
                comment_data = []
                for comment in comments:
                    comment_user_id = comment.user_id
                    try:
                        comment_user = CustomUser.objects.get(id=comment_user_id)
                        comment_user_data = {
                            'username': comment_user.username
                        }
                        comment_data.append({
                            'comment': comment.text,  # Assuming the comment model has a 'text' field
                            'user': comment_user_data
                        })
                    except CustomUser.DoesNotExist:
                        pass
                item['comments'] = comment_data
            else:
                item['comments'] = []
                
        return Response(data)

    def post(self, request):
        serializer = SocialMediaPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#------------------------------------------------------------------------------------
#COMMENTS_VIEW
class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        if not SocialMediaPost.objects.filter(id=post_id).exists():
            return Response({"detail": "The post does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        comments = Comment.objects.filter(post_id=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        post_id = request.data.get('post')
        if not SocialMediaPost.objects.filter(id=post_id).exists():
            return Response({"detail": "The post does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post_id=post_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#--------------------------------------------------------------------------------------
#LIKE_DISLIKE_VIEWS

class LikePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(SocialMediaPost, id=post_id)
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True

        post.save()

        return Response({'liked': liked, 'like_count': post.likes.count()}, status=status.HTTP_200_OK)


class DislikePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(SocialMediaPost, id=post_id)
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            liked = False

        post.save()

        return Response({'liked': liked, 'like_count': post.likes.count()}, status=status.HTTP_200_OK)

#---------------------------------------------------------------------------------------
#GET_DETAIL_VIEW_BY_ID

class UserProfileAPIView(APIView):
    def get(self, request, userID):
        user = get_object_or_404(CustomUser, id=userID)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)