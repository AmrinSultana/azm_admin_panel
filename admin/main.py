import firebase_admin
import datetime
import csv
import re
import string
import random
import logging
from user_creation import create_user, create_or_update_user
from geofence_creation import create_geofence
from team_creation import create_team, update_managers
from user_claim_update import update_user_claims

email_regex = r'^[A-Za-z0-9]+[\._]?[A-Za-z0-9]+[@][-\w]+[.]\w{2,3}$'


def generate_password(uid):
    assert len(uid) >= 4
    a = []
    a.append(uid[0])
    a.append(ord(uid[1]))
    a.append(uid[2])
    a.append(ord(uid[3]))
    return "".join([str(x) for x in a])


def create_or_update_users():
    csv_file = 'data/emp_sample.csv'
    csv_file = open(csv_file, "r")
    dict_reader = csv.DictReader(csv_file)
    unique_uid = set()
    unique_name = set()
    unique_email = set()
    unique_no = set()
    unique_records = []
    for record in dict_reader:
        uid = record['UID'].strip()
        name = record['Name'].strip()
        email = record['Email'].strip()
        phone_number = record['No.'].strip()
        admin_perm = record['admin_perm'].strip()
        admin_perm = True if admin_perm == '1' else False
        app_perm = record['app_perm'].strip()
        app_perm = True if app_perm == '1' else False
        have_image = True if record['IMG'].strip() == '1' else False
        image_path = "https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2F{}-0001.jpg?alt=media".format(
            uid)
        team_id = record['team_id'].strip()
        # https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2FMF02-0001.jpg?alt=media&token=6f9c51e0-c817-46fe-a2a6-3b8879ee2877
        if uid in unique_uid or name in unique_name or email in unique_email or phone_number in unique_no or not re.search(email_regex, email):
            logging.error("Not creating record for: %s" % record)
            continue
        unique_uid.add(uid)
        unique_name.add(name)
        unique_email.add(email)
        unique_no.add(phone_number)
        password = generate_password(uid)
        unique_records.append({
            "uid": uid,
            "name": name,
            "email": email,
            "phone_number": phone_number,
            "admin_perm": admin_perm,
            "app_perm": app_perm,
            "photo_url": image_path if have_image else None,
            "password": password,
            "team_id": team_id
        })
    for record in unique_records:
        print(record)
        logging.info("record: %s" % record)
        create_or_update_user(**record)


def create_geofences():
    csv_file = 'data/geofences.csv'
    csv_file = open(csv_file, "r")
    dict_reader = csv.DictReader(csv_file)
    for record in dict_reader:
        try:
            # print(record)
            locationCode = itemID = record['locationCode'].strip()
            location_latitude = float(record['latitude'].strip())
            location_longitude = float(record['longitude'].strip())
            name = record['name'].strip()
            radius = int(record['radius'].strip())
            create_geofence(locationCode, itemID, location_latitude,
                            location_longitude, name, radius)
        except Exception as ex:
            logging.error(
                "Exception for record {}: Exception: {}".format(record, ex))

def create_teams():
    csv_file = 'data/teams.csv'
    csv_file = open(csv_file, "r")
    dict_reader = csv.DictReader(csv_file)
    unique_team_id = set()
    unique_team_name = set()
    manages_team = {}  # uid to list of team_ids
    unique_records = []
    for record in dict_reader:
        team_id = record['team_id'].strip()
        team_name = record['team_name'].strip()
        managers = record['managers'].strip()
        managers = [manager.strip() for manager in managers.split("|")]
        for manager_uid in managers:
            manages_team.setdefault(manager_uid, []).append(team_id)
        if team_id in unique_team_id or team_name in unique_team_name:
            logging.error("Not creating record for team: %s" % record)
            continue
        unique_team_id.add(team_id)
        unique_team_name.add(team_name)
        unique_records.append({
            "team_id": team_id,
            "team_name": team_name,
            "managers": managers
        })
    # print("manages_team", manages_team)
    for record in unique_records:
        create_team(**record)
    for manager_uid, team_ids in manages_team.items():
        print(manager_uid, team_ids)
        try:
            update_managers(manager_uid, team_ids)
        except firebase_admin._auth_utils.UserNotFoundError:
            logging.error("Not able to map manager to team: %s" % manager_uid)

if __name__ == "__main__":
    # create_or_update_users()
    # create_teams()
    update_user_claims('OS08', admin_perm=True, app_perm=True, superuser_perm=True)
