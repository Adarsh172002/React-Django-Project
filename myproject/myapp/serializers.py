#serializers.py
from rest_framework import serializers
from .models import *
import base64
#--------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','id', 'email', 'password',  'address', 'state', 'country', 'pincode','image','phone_number']
        extra_kwargs = {'password': {'write_only': True},
                        'image': {'required': False}
                        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.state = validated_data.get('state', instance.state)
        instance.country = validated_data.get('country', instance.country)
        instance.pincode = validated_data.get('pincode', instance.pincode)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance
    
#---------------------------------------------------------------------

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user', 'post', 'created_at', 'updated_at')

class SocialMediaPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = SocialMediaPost
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at', 'likes')
        
    
    def get_like_count(self, obj):
        return obj.like_count
