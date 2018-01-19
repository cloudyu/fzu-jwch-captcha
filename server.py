try:
    import Image
except ImportError:
    from PIL import Image
import pytesseract, json, web, base64
from io import BytesIO
pytesseract.pytesseract.tesseract_cmd = 'C:\\Users\\Administrator\\Desktop\\jwch-captcha\\tesseract\\tesseract.exe'
urls = (  
    '/jwch-captcha', 'jwchCaptcha'
)
class jwchCaptcha:
    def GET(self):
        with open('script.user.js', 'rb') as f:
            web.header('Content-Type', 'application/x-javascript;charset=utf-8')
            return f.read()
    def POST(self):
        if web.ctx.env['HTTP_HOST'] != 'jwch.fzu.c-y.in:54088':
            web.header('Content-Type', 'text/html;charset=utf-8')
            return 'fuck you !' 
        try:
            jsonArr = json.loads(web.data().decode('utf-8'))
            imgData = base64.b64decode(jsonArr['data'])
            captcha = pytesseract.image_to_string(Image.open(BytesIO(imgData)), 'fzu-jwch-captcha')
        except Exception as e:
            print(e)
            web.header('Content-Type', 'text/html;charset=utf-8')
            return "error"
        web.header('Content-Type', 'json')
        return (json.dumps({'captcha' : captcha}))

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
