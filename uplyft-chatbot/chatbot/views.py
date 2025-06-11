from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer
from .models import Message
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

# Create your views here.
@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    confirmpass = request.data.get('confirmpassword')

    if not username or not password or not confirmpass:
        return Response({'error': 'Username or password are required.'}, status=400)
    
    if password != confirmpass:
        return Response({'error': 'Passwords do not match.'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "Signup successful"}, status=201)


@api_view(['POST'])
def login(req):
    username = req.data.get('username')
    password = req.data.get('password')

    if not username or not password:
        return Response({'error': 'Username or password are required.'}, status=400)

    user = authenticate(username=username,password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": user.username,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_message(req):
    msg = Message.objects.create(
        user = req.user,
        sender = req.data.get('sender'),
        text = req.data.get("text")
    )

    return Response({"status": "saved"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(req):
    msgs = Message.objects.filter(user=req.user).order_by('time')
    serializer = MessageSerializer(msgs, many=True)
    return Response(serializer.data)

