import firebase_admin
from firebase_admin import auth

firebase_admin.initialize_app()

# Start listing users from the beginning, 1000 at a time.
page = auth.list_users()
while page:
    for user in page.users:
        print('User: ' + user.uid)
    # Get next batch of users.
    page = page.get_next_page()

# Iterate through all users. This will still retrieve users in batches,
# buffering no more than 1000 users in memory at a time.
for user in auth.list_users().iterate_all():
    print('User: ' + user.uid, user)
    auth.update_user(user.uid, photo_url="https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2F{}-0001.jpg?alt=media".format(user.uid))
