from rest_framework import serializers
from .models import Snippet

class SnippetSerializer(serializers.ModelSerializer):

    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Snippet
        fields = "__all__"
        read_only_fields = ['owner' ,'share_token']