# app.py
# purp: to create a basic user-responsive, EV3-hosted web server that can interpret user form input
# last updated: by J.F on July 25, '16 to add comments
# created by: Juliana Furgala

# tutorial for set-up found here: https://www.raspberrypi.org/learning/python-web-server-with-flask/worksheet/
from flask import Flask, render_template, request, jsonify
from ev3dev.auto import *
import ev3dev.ev3 as ev3
import json

ma = ev3.LargeMotor('outA')
mb  = ev3.LargeMotor('outB')
mc = ev3.LargeMotor('outC')
md = ev3.LargeMotor('outD')
s1 = ev3.Sensor('in1')
s2 = ev3.Sensor('in2')
s3 = ev3.Sensor('in3')
s4 = ev3.Sensor('in4')

def getInputs():
    return(jsonify({
        "in1":s1.value(),
        "in2":s2.value(),
        "in3":s3.value(),
        "in4":s4.value()})
    );

def setupInput():
    return(jsonify({

        "in1":s1.modes,
        "in2":s2.modes,
        "in3":s3.modes,
        "in4":s4.modes})
    );


app = Flask(__name__)

# Inspiration for methods parameter and if method == format
# https://github.com/distortenterprises/Webinterface
@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template('index2.html')
    print("Command Received")
    print(request.data)
    if request.method == "POST":
        if request.data == "get":
	        return getInputs()
        elif requst.data == "setup":
            return setupInput()
        else:
            j = json.loads(request.data)
            if request.data.find('outA') >-1:
                if j['outA'] == "forward":
                    ma.run_forever(duty_cycle_sp=40);
                elif j['outA'] == 'backward':
                    ma.run_forever(duty_cycle_sp=-40);
                elif j['outA'] == 'stop':
                    ma.stop();
            if request.data.find('outB') > -1:
                if j['outB'] == "forward":
                    mb.run_forever(duty_cycle_sp=40);
                elif j['outB'] == 'backward':
                    mb.run_forever(duty_cycle_sp=-40);
                elif j['outB'] == 'stop':
                    mb.stop();
            if request.data.find('outC') > -1:
                if j['outC'] == "forward":
                    mc.run_forever(duty_cycle_sp=40);
                elif j['outC'] == 'backward':
                    mc.run_forever(duty_cycle_sp=-40);
                elif j['outC'] == 'stop':
                    mc.stop();
            if request.data.find('outD') > -1:
                if j['outD'] == "forward":
                    md.run_forever(duty_cycle_sp=40);
                elif j['outD'] == 'backward':
                    md.run_forever(duty_cycle_sp=-40);
                elif j['outD'] == 'stop':
                    md.stop();
            print("creating return statement")
            return getInputs();

        return render_template('index2.html')

@app.route('/1')
def index1():
    return render_template('index1.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
