import os
import re

dir_path = r"d:\Github\tracer-study-system\resources\js"
env_var = "import.meta.env.VITE_ADMIN_PORTAL_PREFIX"

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if '/admin/' not in content:
                continue

            original_content = content
            
            # 1. JSX href="/admin/..." -> href={`/${env_var}/...`}
            content = re.sub(r'([a-zA-Z_]+)="\/admin\/([^"]*)"', r'\1={`/${' + env_var + r'}/\2`}', content)
            
            # 2. String literal "/admin/..." -> `/${env_var}/...`
            content = re.sub(r'"\/admin\/([^"]*)"', r'`/${' + env_var + r'}/\1`', content)
            
            # 3. String literal '/admin/...' -> `/${env_var}/...`
            content = re.sub(r'\'\/admin\/([^\']*)\'', r'`/${' + env_var + r'}/\1`', content)
            
            # 4. Template literal `/admin/...` -> `/${env_var}/...`
            content = re.sub(r'`\/admin\/([^`]*)`', r'`/${' + env_var + r'}/\1`', content)
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
