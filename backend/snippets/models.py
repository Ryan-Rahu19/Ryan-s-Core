from django.db import models
from django.contrib.auth.models import User
import uuid

class Snippet(models.Model):

    title      = models.CharField(max_length=200)
    code       = models.TextField()
    language   = models.CharField(max_length=50)
    owner      = models.ForeignKey(User, on_delete=models.CASCADE)
    created    = models.DateTimeField(auto_now_add=True)


    share_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    
    def __str__(self):
        return self.title