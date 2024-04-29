import csv
from PIL import Image, ImageDraw, ImageFont


def create_image(uid):
    img = Image.new('RGB', (350, 200), color='blue')
    # fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 80)
    # use a bitmap font
    fnt = ImageFont.load("arial.pil")

    d = ImageDraw.Draw(img)
    d.text((45, 45), uid, font=fnt, fill='yellow')
    # d.text((45, 45), uid, fill='yellow')
    img.save('azm_images/UserProfile_{}.png'.format(uid))


create_image('MN01')

# a_csv_file = open("AZMUsers.csv", "r")
# dict_reader = csv.DictReader(a_csv_file)

# for a in dict_reader:
#     uid = a['UID'].strip()
#     print('uid', uid)
#     create_image(uid)
