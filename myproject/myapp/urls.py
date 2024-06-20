#urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('posts/', SocialMediaPostListCreateView.as_view(), name='post-list-create'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('like/<int:post_id>/', LikePostAPIView.as_view(), name='like_post'),
    path('dislike/<int:post_id>/', DislikePostAPIView.as_view(), name='dislike_post'),
    path('users/<int:userID>/', UserProfileAPIView.as_view(), name='user-profile'),
]
