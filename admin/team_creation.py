import firebase_admin
from firebase_admin import firestore, auth

db = firestore.client()


def create_team(team_id, team_name, managers=[]):
    managers = list(set(managers))
    doc_ref = db.collection(u'teams').document(team_id)
    doc_ref.set({
        "team_id": team_id,
        "managers": firestore.ArrayUnion(managers),
        "team_name": team_name,
    })
    # for uid in managers:
    #     user = auth.get_user(uid)
    #     print(user.uid, user.custom_claims)
    #     auth.set_custom_user_claims(uid, {
    #         "manages_team_id": team_id,
    #         **user.custom_claims
    #     })


def update_managers(manager_uid, team_ids):
    user = auth.get_user(manager_uid)
    print(user.uid, user.custom_claims)
    auth.set_custom_user_claims(manager_uid, {
        "manages_team_ids": team_ids,
        **user.custom_claims
    })
