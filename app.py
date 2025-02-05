from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import path
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import csv

# Utility function to execute a query and fetch results
def execute_query(query, params=None):
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        if query.strip().upper().startswith("SELECT"):
            return cursor.fetchall()
        else:
            connection.commit()
            return cursor.rowcount

# Home view
def index(request):
    return render(request, 'index.html')

# Sign-up view
def signup(request):
    if request.method == 'POST':
        first_name = request.POST['fname']
        last_name = request.POST['lname']
        dob = request.POST['dob']
        password = make_password(request.POST['password'])

        query = """
            INSERT INTO users (first_name, last_name, dob, password)
            VALUES (%s, %s, %s, %s)
        """
        try:
            execute_query(query, (first_name, last_name, dob, password))
            return redirect('signin')
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return render(request, 'signup.html')

# Sign-in view
def signin(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        password = request.POST.get('password')

        if not first_name or not password:
            return render(request, 'signin.html', {'error': "Please provide both first name and password"})

        query = "SELECT * FROM users WHERE first_name=%s"
        user = execute_query(query, (first_name,))
        if user and check_password(password, user[0][4]):  # Assuming password is the 5th column
            return redirect('selection')
        else:
            return render(request, 'signin.html', {'error': "Invalid credentials"})

    return render(request, 'signin.html')

# Selection view
def selection(request):
    return render(request, 'selection.html')

# Save personality data view
def save_personality(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        personality = request.POST.get('personality')

        if not user_id or not personality:
            return JsonResponse({'status': 'error', 'message': 'Invalid input data'}, status=400)

        query = "INSERT INTO user_personality (user_id, personality) VALUES (%s, %s)"
        try:
            execute_query(query, (user_id, personality))
            return JsonResponse({'status': 'success', 'message': 'Personality saved successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Test views
def attention_test(request):
    return render(request, 'attention_test.html')

def memory_test(request):
    return render(request, 'memory_test.html')

def reading_test(request):
    return render(request, 'reading_test.html')

# Save test result view
def save_test_result(request, test_type):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answer = data.get('user_answer')
        correct_answer = data.get('correct_answer')

        if not user_answer or not correct_answer:
            return JsonResponse({'message': 'Missing required fields'}, status=400)

        result = "Correct" if user_answer == correct_answer else "Incorrect"
        timestamp = timezone.now()
        time_taken = data.get('time_taken', 0)
        correct_attempts = data.get('correct_attempts', 0)
        incorrect_attempts = data.get('incorrect_attempts', 0)

        query = f'''INSERT INTO {test_type}_test_results
                    (test_type, user_answer, correct_answer, result, time_taken, correct_attempts, incorrect_attempts, timestamp)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''
        try:
            execute_query(query, (test_type, user_answer, correct_answer, result, time_taken, correct_attempts, incorrect_attempts, timestamp))
            return JsonResponse({"message": "Result saved successfully!"})
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

# Calculate performance view
def calculate_performance(request):
    query = 'SELECT correct_attempts, incorrect_attempts FROM memory_test_results'
    try:
        results = execute_query(query)
        total_correct = sum(result[0] for result in results)
        total_incorrect = sum(result[1] for result in results)
        total_tests = len(results)

        score = (total_correct / total_tests) * 100 if total_tests > 0 else 0
        memory_capacity = (total_correct / total_tests) * 100 if total_tests > 0 else 0

        return JsonResponse({
            "score": score,
            "total_correct": total_correct,
            "total_incorrect": total_incorrect,
            "memory_capacity": memory_capacity
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

# Dyslexia assessment view
def dyslexia_assessment(request):
    return render(request, 'dyslexia_assessment.html')

# Get username view
def get_username(request, user_id):
    query = "SELECT first_name FROM users WHERE id = %s"
    try:
        user = execute_query(query, (user_id,))
        if user:
            return JsonResponse({'status': 'success', 'username': user[0][0]})
        else:
            return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Dashboard view
def dashboard(request):
    query = "SELECT first_name FROM users LIMIT 1"
    try:
        result = execute_query(query)
        first_name = result[0][0] if result else "User"
        return render(request, 'dashboard.html', {'first_name': first_name})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Load data from CSV file
def load_data(filename):
    data = []
    try:
        with open(filename, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                data.append(row)
    except FileNotFoundError:
        print(f"File {filename} not found.")
    return data

# URL patterns
urlpatterns = [
    path('', index, name='index'),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('selection/', selection, name='selection'),
    path('save_personality/', save_personality, name='save_personality'),
    path('attention_test/', attention_test, name='attention_test'),
    path('memory_test/', memory_test, name='memory_test'),
    path('reading_test/', reading_test, name='reading_test'),
    path('save_attention_result/', lambda request: save_test_result(request, 'attention'), name='save_attention_result'),
    path('save_memory_result/', lambda request: save_test_result(request, 'memory'), name='save_memory_result'),
    path('save_reading_result/', lambda request: save_test_result(request, 'reading'), name='save_reading_result'),
    path('calculate_performance/', calculate_performance, name='calculate_performance'),
    path('dyslexia_assessment/', dyslexia_assessment, name='dyslexia_assessment'),
    path('get_username/<int:user_id>/', get_username, name='get_username'),
    path('dashboard/', dashboard, name='dashboard'),
]