###############################################################################
# Python Server for the System
# By: Sarah Heilich
###############################################################################
# This python file is run on the EV3 and serves webpage that the computer
# connects to.
###############################################################################

# Import needed libraries.
from flask import Flask, render_template, request, jsonify
from ev3dev.auto import *
import ev3dev.ev3 as ev3
import json

# Initiate the motors.
ma = ev3.LargeMotor('outA')
mb  = ev3.LargeMotor('outB')
mc = ev3.LargeMotor('outC')
md = ev3.LargeMotor('outD')
# Initiate the sensors.
s1 = ev3.Sensor('in1')
s2 = ev3.Sensor('in2')
s3 = ev3.Sensor('in3')
s4 = ev3.Sensor('in4')

# Get all the inputs and their values in a JSON object.
def getInputs():
    r = {"in1":-1, "in2":-1, "in3":-1, "in4":-1};
    if s1.connected:
        r["in1"] = s1.value();
    if s2.connected:
        r["in2"] = s2.value();
    if s3.connected:
        r["in3"] = s3.value();
    if s4.connected:
        r["in4"] = s4.value();
    return(jsonify(r));

# Help setup all the inputs by returning their modes in a JSON object.
def setupInput():
    r = {};
    if s1.connected:
        r.update({"in1":s1.modes});
    if s2.connected:
        r.update({"in2":s2.modes});
    if s3.connected:
        r.update({"in3":s3.modes});
    if s4.connected:
        r.update({"in4":s4.modes});

    return(jsonify(r));


# Set the app's name.
app = Flask(__name__)

# When an HTTP request is received
@app.route('/', methods=["GET", "POST"])
def index():
    print(request.data)
    # If it was a GET request, send the proper HTML document.
    if request.method == "GET":
        print("GET")
        return render_template('index2.html')
    # If it was a POST request, determine what type.    
    if request.method == "POST":
        # If it was a "get" request, simple return all the inputs.
        if request.data == "get":
	    print("get")    
            return getInputs()
        # If it was a "setup" request, return the modes of the sensors.
        elif request.data == "setup":
            print("setup")
            return setupInput()
        # If the code makes it here, a JSON object should have been received.
        else:
            # Extract the JSON object.
            j = json.loads(request.data)
            # If the A motor was commanded, change its status as needed.
            if request.data.find('outA') >-1:
                if j['outA'] == "forward":
                    ma.run_forever(duty_cycle_sp=40);
                elif j['outA'] == 'backward':
                    ma.run_forever(duty_cycle_sp=-40);
                elif j['outA'] == 'stop':
                    ma.stop();
            # If the B motor was commanded, change its status as needed.
            if request.data.find('outB') > -1:
                if j['outB'] == "forward":
                    mb.run_forever(duty_cycle_sp=40);
                elif j['outB'] == 'backward':
                    mb.run_forever(duty_cycle_sp=-40);
                elif j['outB'] == 'stop':
                    mb.stop();
            # If the C motor was commanded, change its status as needed.
            if request.data.find('outC') > -1:
                if j['outC'] == "forward":
                    mc.run_forever(duty_cycle_sp=40);
                elif j['outC'] == 'backward':
                    mc.run_forever(duty_cycle_sp=-40);
                elif j['outC'] == 'stop':
                    mc.stop();
            # If the D motor was commanded, change its status as needed.
            if request.data.find('outD') > -1:
                if j['outD'] == "forward":
                    md.run_forever(duty_cycle_sp=40);
                elif j['outD'] == 'backward':
                    md.run_forever(duty_cycle_sp=-40);
                elif j['outD'] == 'stop':
                    md.stop();
            # Return the current sensor values.
            return getInputs();

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
