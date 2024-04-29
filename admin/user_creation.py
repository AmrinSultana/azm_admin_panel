import firebase_admin
from firebase_admin import auth

firebase_admin.initialize_app()


def create_user(uid, name, email_id, phone_number, password, admin_perm=False, app_perm=True, photo_url=None):
    assert isinstance(admin_perm, bool)
    assert isinstance(app_perm, bool)
    user = auth.create_user(uid=uid, display_name=name, email=email_id,
                            email_verified=True, photo_url=photo_url, password=password, disabled=False, phone_number=phone_number)
    return user


def create_or_update_user(uid, name, email, phone_number, password, admin_perm=False, app_perm=True, photo_url=None, team_id=None):
    assert isinstance(admin_perm, bool)
    assert isinstance(app_perm, bool)
    try:
        user = auth.get_user(uid)
        auth.update_user(uid, display_name=name, email=email,
                         password=password, phone_number=phone_number, photo_url=photo_url)
    except firebase_admin.auth.UserNotFoundError:
        create_user(uid, name, email, phone_number, password,
                    admin_perm=admin_perm, app_perm=app_perm, photo_url=photo_url)
    auth.set_custom_user_claims(uid, {
        'admin': admin_perm,
        'app': app_perm,
        'team_id': team_id
    })

# create_user('xyz', 'xyz', 'xyz@gmail.com', '123456789',
#             'admin123', admin=True, app=False)
