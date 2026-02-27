import subprocess

try:
    result = subprocess.run(['npx', 'tsc', '--noEmit', '--pretty', 'false'], 
                           cwd=r'c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque',
                           capture_output=True, text=True)
    print("STDOUT:")
    print(result.stdout)
    print("\nSTDERR:")
    print(result.stderr)
except Exception as e:
    print(f"Error: {e}")
