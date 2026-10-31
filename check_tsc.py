import subprocess

try:
    result = subprocess.run(['npx', 'tsc', '--noEmit', '--pretty', 'false'], 
                           cwd='.',
                           capture_output=True, text=True)
    print("STDOUT:")
    print(result.stdout)
    print("\nSTDERR:")
    print(result.stderr)
except Exception as e:
    print(f"Error: {e}")
