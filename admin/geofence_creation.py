import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# firebase_admin.initialize_app()
db = firestore.client()


def create_geofence(locationCode, itemID, location_latitude, location_longitude, name, radius):

    doc_ref = db.collection(u'geofences').document(locationCode)
    doc_ref.set({
        "itemID": itemID,
        "location": firestore.GeoPoint(location_latitude, location_longitude),
        "locationCode": locationCode,
        "name": name,
        "radius": radius
    })

