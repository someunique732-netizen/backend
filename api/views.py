from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from datetime import date
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from .models import (
    Order, OrderItem, ItemVariant,
    Category, Customer
)

import json

from .models import *
from .serializers import *




@api_view(["GET"])
def monthly_revenue(request):

    today = date.today()
    data = []

    for i in range(6):
        month = today.month - i
        year = today.year

        if month <= 0:
            month += 12
            year -= 1

        orders = Order.objects.filter(
            order_date__month=month,
            order_date__year=year
        )

        total = sum(o.total_amount() for o in orders)

        data.append({
            "month": f"{month}/{year}",
            "revenue": float(total)
        })

    return Response(data[::-1])


@api_view(["GET"])
def dashboard(request):

    orders = Order.objects.all()
    customers = Customer.objects.all()

    # =====================
    # REVENUE (REAL)
    # =====================
    revenue = sum(o.total_amount() for o in orders)

    # =====================
    # PROFIT (ORDER BASED FIX)
    # =====================
    profit = Decimal("0")

    order_items = OrderItem.objects.select_related("variant__item")

    for item in order_items:
        cost = item.variant.item.cost_price
        sell = item.price
        profit += (sell - cost) * item.quantity

    # =====================
    # CATEGORY SALES (FIXED)
    # =====================
    category_data = []

    category_data = (
        Category.objects.annotate(
            value=Sum('items__variants__orderitem__quantity')
        ).values('category_name', 'value')
    )

    # =====================
    # RECENT ORDERS
    # =====================
    recent_orders = orders.order_by("-order_date")[:5]

    # =====================
    # LOW STOCK
    # =====================
    low_stock = ItemVariant.objects.filter(stock__lte=5)

    return Response({
        "revenue": float(revenue),
        "profit": float(profit),
        "orders": orders.count(),
        "customers": customers.count(),

        "category_data": category_data,

        "recent_orders": [
            {
                "id": o.id,
                "customer": o.customer.customer_name,
                "amount": float(o.total_amount()),
                "date": o.order_date.strftime("%Y-%m-%d"),
            }
            for o in recent_orders
        ],

        "low_stock_items": [
            {
                "id": v.id,
                "name": f"{v.item.item_name} ({v.size})",
                "stock": v.stock
            }
            for v in low_stock
        ]
    })

@api_view(["POST"])
@permission_classes([AllowAny])  # Later change to IsAdminOrManager
def create_user(request):

    username = request.data.get("username")
    password = request.data.get("password")

    full_name = request.data.get("full_name")
    role = request.data.get("role", "sales")

    phone = request.data.get("phone")
    email = request.data.get("email")
    address = request.data.get("address")

    if not username or not password:
        return JsonResponse({
            "success": False,
            "message": "username and password required"
        }, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({
            "success": False,
            "message": "user already exists"
        }, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    SalesPerson.objects.create(
        user=user,
        full_name=full_name,
        role=role,
        phone=phone,
        email=email,
        address=address,
    )

    return JsonResponse({
        "success": True,
        "message": "user created successfully"
    })
# ================= AUTH =================

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    user = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password")
    )

    if not user:
        return JsonResponse(
            {"message": "invalid credentials"},
            status=400
        )

    refresh = RefreshToken.for_user(user)

    salesperson = SalesPerson.objects.get(user=user)

    return JsonResponse({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": salesperson.role,
        "name": salesperson.full_name,
    })