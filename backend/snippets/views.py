from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Snippet
from .serializers import SnippetSerializer


class SnippetViewSet(viewsets.ModelViewSet):
    serializer_class = SnippetSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Snippet.objects.all().order_by('-created')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        snippet = self.get_object()
        if snippet.owner != request.user:
            return Response(
                {'error': 'You are not allowed to edit this snippet.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        snippet = self.get_object()
        if snippet.owner != request.user:
            return Response(
                {'error': 'You are not allowed to delete this snippet.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)



@api_view(['GET'])
@permission_classes([AllowAny])
def public_snippet(request, share_token):
    try:
        snippet = Snippet.objects.get(share_token=share_token)
    except Snippet.DoesNotExist:
        return Response({'error': 'Snippet not found.'}, status=404)

    return Response({
        'title':    snippet.title,
        'language': snippet.language,
        'code':     snippet.code,
        'owner':    snippet.owner.username,
        'created':  snippet.created,
    })



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)

    return Response({
        'token': token.key,
        'username': user.username
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error': 'Invalid credentials'}, status=400)

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'username': user.username
    })