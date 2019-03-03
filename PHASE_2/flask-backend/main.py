import flask

app = flas.Flask("__main__")


@app.rout("/")
def my_index():
    return flask.render_template("index.html", token="Hello Flask+React")

app.run(debug=True)