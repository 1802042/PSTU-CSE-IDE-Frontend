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
