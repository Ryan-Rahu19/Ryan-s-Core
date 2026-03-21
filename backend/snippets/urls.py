from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SnippetViewSet, register, login, public_snippet

router = DefaultRouter()
router.register(r'snippets', SnippetViewSet, basename='snippet')

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('snippet/<uuid:share_token>/', public_snippet),
]

urlpatterns += router.urls