import re

# Read the input file
with open('input.txt', 'r') as file:
    content = file.read()

# Define the regex pattern to match the desired lines
pattern = r'<sfml-flyer-image-a aria-label=.*?</sfml-flyer-image-a>'

# Find all matches
matches = re.findall(pattern, content, re.DOTALL)

pattern = r'label="([^"]+)"'

# Find all matches
matches = re.findall(pattern, content)


pattern = r'\|\s*([^,]+?)(?:,| \d+ mL| \d+ G).*?(\$[\d.,]+)'

matches = re.findall(pattern, content)

matches = list(set(matches))

# Write cleaned results
with open('output.txt', 'w', encoding='utf-8') as output_file:
    for product, price in matches:
        # Clean up product names
        product = product.split('|')[-1].strip()  # Handle nested pipes
        product = re.sub(r'\s{2,}', ' ', product)  # Remove extra spaces
        
        output_file.write(f"{product} - {price}\n")

print("Extraction complete. Check 'output.txt' for the results.")