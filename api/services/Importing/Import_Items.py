import pandas as pd

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.models import (
    Category,
    Item,
    ItemVariant,
)


class ImportItemsView(APIView):

    def post(self, request):

        file = request.FILES.get("excel_file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            if file.name.endswith(".csv"):
                df = pd.read_csv(file)
            else:
                df = pd.read_excel(file)

            imported = 0

            for _, row in df.iterrows():

                category_name = str(
                    row["category_name"]
                ).strip()

                category, _ = Category.objects.get_or_create(
                    category_name=category_name
                )

                item, created = Item.objects.get_or_create(
                    item_name=str(
                        row["item_name"]
                    ).strip(),
                    defaults={
                        "category": category,
                        "cost_price": row["cost_price"],
                        "selling_price": row["selling_price"],
                        "market_price": row["market_price"],
                    }
                )

                if not created:
                    item.category = category
                    item.cost_price = row["cost_price"]
                    item.selling_price = row["selling_price"]
                    item.market_price = row["market_price"]
                    item.save()

                sku = str(row["sku"]).strip()
                barcode = str(row["barcode"]).strip()

                if ItemVariant.objects.filter(
                    sku=sku
                ).exists():
                    continue

                if ItemVariant.objects.filter(
                    barcode=barcode
                ).exists():
                    continue

                ItemVariant.objects.create(
                    item=item,
                    size=str(row["size"]).strip(),
                    design=str(
                        row.get("design", "")
                    ).strip(),
                    stock=int(row["stock"]),
                    sku=sku,
                    barcode=barcode,
                )

                imported += 1

            return Response({
                "message": "Import successful",
                "total_imported": imported,
            })

        except Exception as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )