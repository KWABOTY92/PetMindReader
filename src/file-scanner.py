import os
import mimetypes

def is_text_file(filename):
    """
    Check if a file is likely to be a text file based on its mime type
    or common code file extensions
    """
    # Common code file extensions
    code_extensions = {
        '.py', '.js', '.java', '.cpp', '.c', '.h', '.cs', '.php',
        '.rb', '.swift', '.kt', '.go', '.rs', '.ts', '.html', '.css',
        '.sql', '.sh', '.bat', '.ps1', '.txt', '.md', '.json', '.xml',
        '.yaml', '.yml', '.ini', '.conf', '.cfg', '.tsx'
    }
    
    # Check extension
    ext = os.path.splitext(filename)[1].lower()
    if ext in code_extensions:
        return True
        
    # Check mime type
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type and mime_type.startswith('text/')

def scan_directory(output_file):
    """
    Recursively scan the current directory and its subdirectories
    for text/code files and write their contents to the output file
    """
    with open(output_file, 'w', encoding='utf-8') as out:
        for root, _, files in os.walk('.'):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Skip the output file itself
                if os.path.abspath(file_path) == os.path.abspath(output_file):
                    continue
                    
                if is_text_file(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            # Write file path with clear separator
                            out.write(f"\n{'='*80}\n")
                            out.write(f"File: {os.path.abspath(file_path)}\n")
                            out.write(f"{'='*80}\n\n")
                            
                            # Write file contents
                            out.write(f.read())
                            out.write('\n')
                    except Exception as e:
                        out.write(f"Error reading file {file_path}: {str(e)}\n")

if __name__ == '__main__':
    output_file = 'code_contents.txt'
    print(f"Scanning directory and writing contents to {output_file}...")
    scan_directory(output_file)
    print("Scan complete!")
