from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,PermissionsMixin
from django.core.validators import RegexValidator


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, phone_number, address, state, country, pincode, password=None, **extra_fields):
        if not username:
            raise ValueError('The username field must be set')
        if not email:
            raise ValueError('The email field must be set')
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            phone_number=phone_number,
            address=address,
            state=state,
            country=country,
            pincode=pincode,
            **extra_fields
        )
        if password:
            user.set_password(password)  # Hash the password
        user.save(using=self._db)
    
        
        print(user)
        return user

    def create_superuser(self, username, email, phone_number, address, state, country, pincode, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, phone_number, address, state, country, pincode, password, **extra_fields)

class CustomUser(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(regex=r'^\d{10,15}$')])
    address = models.CharField(max_length=255)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'phone_number', 'address', 'state', 'country', 'pincode']

    def __str__(self):
        return self.username
    
    
    def save(self, *args, **kwargs):
        # Ensure the password is hashed before saving
        if self.pk is None and self.password:
            self.set_password(self.password)
        elif self.pk is not None:
            original_user = CustomUser.objects.get(pk=self.pk)
            if self.password != original_user.password:
                self.set_password(self.password)
        super().save(*args, **kwargs)

class SocialMediaPost(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    image = models.ImageField(upload_to='social_media_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(CustomUser, related_name='likes', blank=True)

    def __str__(self):
        return f'{self.user.username}: {self.text[:30]}'
    
    def like_count(self):
        return self.likes.count()

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(SocialMediaPost, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username}: {self.text[:30]}'
