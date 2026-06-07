from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

import json

from .models import *
from .serializers import *



class MonthlyRevenueAPIView(APIView):

    def get(self, request):

        monthly_data = (
            Order.objects
            .annotate(month=TruncMonth("order_date"))
            .values("month")
            .annotate(revenue=Sum("paid_amount"))
            .order_by("month")
        )

        data = [
            {
                "month": item["month"].strftime("%b %Y"),
                "revenue": item["revenue"] or 0
            }
            for item in monthly_data
        ]

        return Response(data)

class DashboardAPIView(APIView):

    def get(self, request):

        # 📊 Revenue (total paid amount)
        total_revenue = Order.objects.aggregate(
            total=Sum("paid_amount")
        )["total"] or 0

        # 📦 Orders count
        total_orders = Order.objects.count()

        # 👤 Customers
        total_customers = Customer.objects.count()

        # 💰 Profit (simple version example)
        profit = Order.objects.aggregate(
            total=Sum("paid_amount")
        )["total"] or 0

        # 📅 Recent Orders
        recent_orders = Order.objects.select_related(
            "customer"
        ).order_by("-order_date")[:5]

        recent_orders_data = [
            {
                "id": o.id,
                "customer": o.customer.customer_name,
                "amount": o.paid_amount,
                "date": o.order_date.date()
            }
            for o in recent_orders
        ]

        # 📊 Category distribution
        category_data = Category.objects.annotate(
            value=Count("items")
        ).values("category_name", "value")

        # 📉 Low stock items
        low_stock = Item.objects.filter(
            variants__stock__lte=5
        ).distinct()

        low_stock_data = [
            {
                "id": i.id,
                "name": i.item_name,
                "stock": sum(v.stock for v in i.variants.all())
            }
            for i in low_stock
        ]

        return Response({
            "revenue": total_revenue,
            "orders": total_orders,
            "customers": total_customers,
            "profit": profit,

            "recent_orders": recent_orders_data,
            "category_data": category_data,
            "low_stock_items": low_stock_data,
        })
    


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