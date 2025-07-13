from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Product(models.Model):
    """Represents a product available for sale."""
    name = models.CharField(max_length = 100)
    brand = models.CharField(max_length = 100)
    price = models.FloatField()
    image = models.URLField()
    rating = models.FloatField()
    stock = models.IntegerField()

    def __str__(self):
        return self.name

class CartItem(models.Model):
    """Represents an item added to a user's shopping cart."""
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    product = models.ForeignKey("Product",on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default = 1)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"