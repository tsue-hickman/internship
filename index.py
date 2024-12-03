from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# Connect to PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="navy_strike_groups",  # your database name
        user="padawan",  # your username
        password="g0f1ghtw1n",  # your password
    )
    return conn

@app.route('/strike-groups', methods=['GET'])
def get_strike_groups():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM strike_groups')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True, port=3000)  # The server will run on port 3000
