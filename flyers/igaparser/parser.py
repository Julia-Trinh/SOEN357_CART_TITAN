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


# Define the second pattern to match product name and price
# This pattern will capture the product name and price from each line
product_price_pattern = r"([A-Za-zÀ-ÿ\s\|,]+)\s[\|\-]?\s?.*\$(\d+\.\d+)"

# List to hold the final results
product_price_matches = []

# Apply the second pattern to extract product name and price
for match in matches:
    result = re.findall(product_price_pattern, match)
    if result:
        product_price_matches.append(f"{result[0][0].strip()} ${result[0][1]}")

# Remove duplicates by converting the list to a set and back to a list
product_price_matches = list(set(product_price_matches))

# Write the matches to a new file
with open('output.txt', 'w') as output_file:
    for match in product_price_matches:
        output_file.write(match + '\n')

print("Extraction complete. Check 'output.txt' for the results.")