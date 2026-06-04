from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

from .models import *
from .serializers import *


@csrf_exempt
def create_user(request):

    if request.method == "POST":

        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({
            "success": False,
            "message": "username and password required"
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"success": False, "message": "user already exists"},
                status=400
            )

        User.objects.create_user(
            username=username,
            password=password
        )

        return JsonResponse({
            "success": True,
            "message": "user created successfully"
        })

    return JsonResponse(
        {"error": "invalid request"},
        status=405
    )

# ================= AUTH =================

@csrf_exempt
def login_view(request):
    if request.method == "POST":

        data = json.loads(request.body)

        print("LOGIN DATA:", data)

        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        print("USER:", user)

        if user:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        return JsonResponse(
            {"success": False, "message": "invalid credentials"},
            status=400
        )