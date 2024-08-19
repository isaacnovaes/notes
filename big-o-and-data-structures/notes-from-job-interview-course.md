# Big-O Asymptotic Analysis

## Big-O Complexity

- **Purpose**:
  - Explains how well a problem is solved.
  - Measures code performance and scalability.
  - Indicates how long an algorithm takes to run.
  - Determines how many operations a task requires to execute.

## Characteristics of Good Code

- **Readable** and **reliable**.
- Possesses good readability, high execution speed, and low memory usage.
- Scalability involves both time (speed) and memory.
- Each pillar has a trade-off.

### Worst Case Scenario

- **Worst case** forces the algorithm to run the maximum amount possible.
  
### Complexity Notations

- **Indented**: sum operations.
- **Nested**: multiply operations.

## Time Complexity Types

- **O(1)** - Constant time - Excellent
- **O(n)** - Linear time - Proportional - Fair
  - Different inputs should have different variables.
- **O(n^2)** - Quadratic time - Horrible
  - Involves nested loops.

## Space Complexity Types

### What Causes Space Complexity?

- **Variables**
- **Data Structures**
- **Function Calls**
- **Allocations**

If something is created or called, memory is used, causing space complexity to rise.

## Data Structures

### Arrays

- **Operations**: 
  - Access: O(n)
  - Insert: O(n)
  - Deletion: O(n)
  - Search: O(n)

### Hash Tables (Hash Maps, Maps)

- **Operations**: 
  - Access: O(1)
  - Insert: O(1)
  - Deletion: O(1)
  - Search: O(1)
- **Notes**:
  - Use a hash key.
  - Issues include collision and entry overflow.

### Linked Lists

- **Operations**: 
  - Access: O(n)
  - Insert: O(n)
  - Deletion: O(n)
- Built with objects in JavaScript.
- Formed by nodes.
  - A node includes two parts:
    - A value.
    - A pointer linking to the next node.
  - The first node is called **head**. The last is **tail**.

### Stack

- **Operations**:
  - Access: O(n)
  - Pop: O(1)
  - Push: O(1)
  - Peek: O(1)
- **Concept**: LIFO (Last In, First Out).
  - Operate on the last item first.
  - Example: Browser history, Ctrl+Z.

### Queue

- **Operations**:
  - Access: O(n)
  - Dequeue: O(1)
  - Enqueue: O(1)
  - Peek: O(1)
- **Concept**: FIFO (First In, First Out).
  - Built with linked lists.
  - Example: Uber, Printer.

### Trees

- **Operations**:
  - Access: O(log n)
  - Insert: O(log n)
  - Delete: O(log n)
- **Components**:
  - Root
  - Parent
  - Child
  - Sibling
  - Leaf (end of each branch)

#### Binary Tree

- **Rules**:
  - Each node can have zero, one, or two children nodes.
  - Each child can have only one parent.
  - The number of nodes at one level minus one equals the number of nodes in the levels above.

#### Binary Search Tree

- **Rules**:
  - It is a full binary tree (unbalanced) [Access O(n), Insert O(n), Delete O(n)] or a perfect binary tree (balanced) [Access O(log n), Insert O(log n), Delete O(log n)].
  - The child node on the right has a bigger value than its parent and its sibling on the left.

#### Binary Max/Min Heap

- **Operations**: 
  - Access: O(n)
  - Insert: O(log n)
  - Delete: O(log n)
- **Rules**:
  - The parent must be bigger than its two children.
  - The child node on the right has a bigger value than its parent and its sibling on the left.
  - The binary heap data structure is different from the memory heap.

### Graphs

- **Components**:
  - Node
  - Edge

Linked lists → Trees → Graphs

- **Types**:
  - **Directed**: Travel only in one direction.
  - **Undirected**: Travel forwards and backwards.
  - **Weighted**: Edges have values related to the connection.
  - **Unweighted**: Edges have no value.
  - **Cyclic**: Nodes are connected in a circular way.
  - **Acyclic**: Some nodes are outside the circle.

## Recursion

- **Problem**: If there is no way to stop it, recursion can cause a stack overflow problem when there is insufficient memory to process the call stack.
- **Base Case**: A safeguard to stop the recursion.
- **Identify the Return Case**: What has to bubble up the call stack.
  - Usually involves two returns: the base case and the return case.

### Steps

1. Find the base case.
2. Find the return case.

- **Drawback**: Increases stack space.

- **Consider recursion** for trees or converting something into a tree.
- If recursion is possible, so is an iterative solution.

### Important Algorithms

- **Merge Sort** and **Quick Sort**.
- **Tree and Graph Traversal**.

## Sort Algorithms

### Basic

- **Bubble Sort**: 
  - In each iteration, move up (bubble up) the bigger value of the comparison.
- **Selection Sort**:
  - Select the smallest, compare it to the whole array, and place the smallest at the beginning.
- **Insertion Sort**:
  - Compare two items. If `item[i+1] < item[i]`, swap them and swap previous items until one item is bigger than the previous. Stop and go to the next iteration.
  - Good for small and almost sorted lists. Best case is O(n).

### Complex

- **Divide and Conquer & Recursion Techniques** - O(n log n):
  - **Merge Sort**: One of the most efficient. Stable (maintains order of identical items).
  - **Quick Sort**: Uses a pivot for comparison. Very effective. If the pivot is the smallest, it is even better. Nasty space complexity of O(log N).

### When to Use Each Sort Algorithm?

- **Bubble Sort?** Never.
- **Selection Sort?** Never.
- **Insertion Sort?** If the list is small & almost sorted.
- **Merge Sort?** Use if concerned about worst-case scenarios [O(N log N)]. Avoid if concerned about memory [O(n)].
- **Quick Sort?** Excellent choice if not worried about the worst case. Be cautious of pivot selection; the worst case is O(n^2). Better space complexity [O(log n)].

### Non-comparison Algorithms

These outperform O(n log n) time complexity.

- **Use**:
  - How data is stored in computers (zeros and ones).
- **Limitation**:
  - Works only with integers in a restricted range.
  - **Examples**:
    - Radix sort.
    - Counting sort.

## Searching Algorithms

- **Linear Search**:
  - Sequentially checks each item until a match is found. Most common algorithm: O(n). For ordered lists, binary search is better.
- **Binary Search**:
  - Go to the middle of the list, discard the smallest (left part). Repeat until the item is found: O(log n). Excellent for sorted lists.

### BFS and DFS

- **Time Complexity**: O(n)
- **Breadth First Search (BFS)**:
  - Traverses left to right on each node, level by level.
  - Pros: Finds the smallest path.
  - Cons: Requires more memory.
- **Depth First Search (DFS)**:
  - Traverses top to bottom, then back up to parent and checks the other side.
  - Pros: Uses less memory, good for determining whether a path exists.
  - Cons: Can be slow, bad for deep trees.

## Interview Preparation

### Tips

- Show that it is nice to be around you.
- Don't be overly active; be straightforward.

### Questions to Answer During a Non-Technical Interview

1. **Can you do the job?**
2. **Can I work with you?**
3. **Are you going to improve?**

### Your Story Should Include These Four Heroes

1. **Technical**
2. **Success**
3. **Leadership**
4. **Challenge**

- Write down two stories that contain these four heroes.

### Questions to Ask the Interviewer

- What was the biggest mistake you made during the first years of your career?
- Where do you see this company in the next three years?
  - "I want to work for X, but you work for X and have better knowledge than I do, so I would like to see where X is heading."
- Why did you join X? Why do you work for X?
- Have you seen your skills improve since you started working for X?
- What do you wish someone told you when you started working for X?