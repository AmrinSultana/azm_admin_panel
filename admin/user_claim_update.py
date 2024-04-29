from firebase_admin import auth


def update_user_claims(uid, admin_perm=False, app_perm=False, superuser_perm=False):
    # {'app': False, 'admin': False, 'superuser': True, 'team_id': '2', 'manages_team_ids': ['1', '2']}
    user = auth.get_user(uid)
    print(user.__dict__)
    print()
    print("Pre claims >>>")
    print(user.custom_claims)
    print()
    custom_claims = dict(user.custom_claims)
    claims = {
      'admin': admin_perm,
      'app': app_perm,
      'superuser': superuser_perm,
    }
    custom_claims.update(claims)
    print("Post claims >>>")
    print(custom_claims)
    # auth.set_custom_user_claims(uid, custom_claims)
