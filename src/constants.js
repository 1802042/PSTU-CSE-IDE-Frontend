const languageTemplates = {
  javascript: `// JavaScript Template
  console.log("Hello, World!");
  
  function add(a, b) {
    return a + b;
  }
  
  console.log(add(5, 3));`,

  python: `# Python Template
  print("Hello, World!")
  
  def add(a, b):
      return a + b
  
  print(add(5, 3))`,

  java: `// Java Template
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
          System.out.println(add(5, 3));
      }
  
      public static int add(int a, int b) {
          return a + b;
      }
  }`,

  cpp: `// C++ Template
  #include <iostream>
  
  int add(int a, int b) {
      return a + b;
  }
  
  int main() {
      std::cout << "Hello, World!" << std::endl;
      std::cout << add(5, 3) << std::endl;
      return 0;
  }`,
};

export default languageTemplates;
