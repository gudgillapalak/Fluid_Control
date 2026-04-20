from pymongo import MongoClient
import pandas as pd

df = pd.read_excel("fluid.xlsx")
data = df.to_dict(orient="records")

client = MongoClient("mongodb+srv://sudiksha22310260_db_user:<db_password>@cluster0.1f3tlqz.mongodb.net/")

db = client["mydatabase"]
collection = db["fluids"]

collection.insert_many(data)

print("✅ Data uploaded!")