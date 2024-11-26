from flask import Flask, render_template, request, redirect, url_for
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    to_email = "dmat771@gmail.com"
    subject = "Сообщение с сайта визитки"
    name = request.form.get('name')
    message = request.form.get('message')

    body = f"Имя: {name}\n\nСообщение:\n{message}"

    try:
        send_email_to(to_email, subject, body)
        return redirect(url_for('home'))
    except Exception as e:
        return f"Ошибка отправки письма: {e}"

def send_email_to(to_email, subject, body):
    from_email = os.getenv('EMAIL_USER')
    from_password = os.getenv('EMAIL_PASS')

    if not from_email or not from_password:
        raise ValueError("Переменные окружения EMAIL_USER и EMAIL_PASS не установлены.")

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()

if __name__ == '__main__':
    app.run(debug=True)
