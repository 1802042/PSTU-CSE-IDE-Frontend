export const languageTemplates = {
  javascript: `
// JavaScript Template
console.log("Hello, World!");

function add(a, b) {
  return a + b;
}

console.log(add(5, 3));`,

  python: `
# Python Template
print("Hello, World!")

def add(a, b):
    return a + b

print(add(5, 3))`,

  java: ` 
// Java Template
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(add(5, 3));
    }

    public static int add(int a, int b) {
        return a + b;
    }
}`,

  cpp: `
// C++ Template
#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << add(5, 3) << std::endl;
    return 0;
}`,
  c: `
// C Template
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}
int main() {
    printf("Hello, World!\\n");
    printf("%d\\n", add(5, 3));
    return 0;
}`,
};

export const mapLanguage = {
  50: "C",
  54: "C++",
  62: "Java",
  63: "JavaScript",
  71: "Python",
};

export const mapLanguageId = {
  c: "50",
  cpp: "54",
  java: "62",
  javascript: "63",
  python: "71",
};

export const codeExamples = {
  C: `
#include <stdio.h>
#include <stdlib.h>
int compare(const void *a, const void *b) {
    return *(int *)a - *(int *)b;
}
int main() {
    int numbers[] = {5, 2, 8, 1, 9};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    qsort(numbers, size, sizeof(int), compare);
    for (int i = 0; i < size; i++)
        printf("%d ", numbers[i]);
    printf("\\n");
    return 0;
}
`,
  cpp: `
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
  std::vector<int> numbers = {5, 2, 8, 1, 9};
  std::sort(numbers.begin(), numbers.end());
  
  for (int num : numbers) {
      std::cout << num << " ";
  }

  return 0;
}
  `,
  python: `
def sort_and_print(numbers):
  print("Original list:", numbers)
  numbers.sort()

  print("Sorted list:", numbers)

numbers = [5, 2, 8, 1, 9]

sort_and_print(numbers)

for i, num in enumerate(numbers):
  print(f"Element at index {i}: {num}")
  
print("All elements printed successfully.")

`,
  javascript: `
function sortAndPrint(numbers) {
  console.log("Original list:", numbers);

  numbers.sort((a, b) => a - b);
  console.log("Sorted list:", numbers);
}

let numbers = [5, 2, 8, 1, 9];
sortAndPrint(numbers);

numbers.forEach((num, i) => {
  console.log(\`Element at index \${i}: \${num}\`);
});
console.log("All elements printed successfully.");

`,
  java: `import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
      int[] numbers = {5, 2, 8, 1, 9};
      System.out.println("Original list: " + Arrays.toString(numbers));

      Arrays.sort(numbers);
      System.out.println("Sorted list: " + Arrays.toString(numbers));
      for (int i = 0; i < numbers.length; i++) {
          System.out.println("Element at index " + i + ": " + numbers[i]);
      }
      
      System.out.println("All elements printed successfully.");
  }
}
`,
};
