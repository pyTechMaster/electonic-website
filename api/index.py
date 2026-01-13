from app import create_app

# Create the Flask app instance
app = create_app('production')

# This is required for Vercel serverless functions
def handler(request):
    return app(request.environ, request.start_response)