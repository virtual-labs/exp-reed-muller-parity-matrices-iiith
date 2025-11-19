## Generator Matrix Construction for RM Codes

While the polynomial evaluation method provides a powerful algebraic definition for Reed-Muller codes, an alternative and equally fundamental approach is to construct their generator matrix directly using linear algebra, specifically the Kronecker product. This method reveals the code's recursive structure and provides a direct path to its implementation.

### 1. The Kronecker Product

The Kronecker product, denoted by the symbol $\otimes$, is an operation on two matrices of arbitrary size, resulting in a larger block matrix.

If $A$ is an $m \times n$ matrix and $B$ is a $p \times q$ matrix, their Kronecker product $A \otimes B$ is the $mp \times nq$ block matrix:

$$
A \otimes B = \begin{pmatrix} a_{11}B & a_{12}B & \cdots & a_{1n}B \\ a_{21}B & a_{22}B & \cdots & a_{2n}B \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1}B & a_{m2}B & \cdots & a_{mn}B \end{pmatrix} 
$$

Essentially, each element $a_{ij}$ of matrix $A$ is replaced by the scaled matrix $a_{ij}B$.

The Kronecker product is associative, meaning we can extend it to multiple matrices in a straightforward sequence:
$$ 
A \otimes B \otimes C = (A \otimes B) \otimes C = A \otimes (B \otimes C) 
$$
This allows us to define the $m$-fold Kronecker product of a matrix with itself, denoted $G^{\otimes m}$.

### 2. The RM Generator Kernel

The entire family of Reed-Muller codes can be constructed from the $m$-fold Kronecker product of a simple $2 \times 2$ kernel matrix, operating in the binary field $\mathbb{F}_2$:
$$ 
G_2 = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} 
$$
The matrix for an $RM(m, m)$ code, which is the space of all possible Boolean functions in $m$ variables, is given by $G_2^{\otimes m}$. This is a $2^m \times 2^m$ matrix.

#### Example: Small values of $m$

*   For $m=2$, the matrix is $G_2^{\otimes 2}$:
    $$ 
    G_2^{\otimes 2} = G_2 \otimes G_2 = \begin{pmatrix} 1 \cdot G_2 & 1 \cdot G_2 \\ 0 \cdot G_2 & 1 \cdot G_2 \end{pmatrix} = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{pmatrix} 
    $$

*   For $m=3$, the matrix is $G_2^{\otimes 3}$:
    $$ 
    G_2^{\otimes 3} = G_2^{\otimes 2} \otimes G_2 = \begin{pmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 & 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \end{pmatrix} 
    $$

### 3. Selecting Rows for the Generator Matrix

The generator matrix for a specific $RM(r,m)$ code is a submatrix of $G_2^{\otimes m}$, formed by selecting a specific subset of its rows.

An observation on the matrix $G_2^{\otimes m}$ is that the Hamming weight of its rows takes values $2^k$ for $k \in \{0, 1, ..., m\}$. The selection rule is based on these weights:

> The generator matrix for the $RM(r,m)$ code, denoted $G_{RM(r,m)}$, is formed by taking all rows of $G_2^{\otimes m}$ whose Hamming weight is greater than or equal to $2^{m-r}$.

*   **Number of Rows:** The number of rows selected by this rule is precisely $k = \sum_{i=0}^r \binom{m}{i}$, which is the dimension of the $RM(r,m)$ code.
*   **Linear Independence:** Since $G_2$ is an invertible matrix, its $m$-fold Kronecker product $G_2^{\otimes m}$ is also invertible. This means all of its $2^m$ rows are linearly independent. Therefore, any subset of these rows—including the set we select for our generator matrix—is also linearly independent.

#### 3.1 Examples of Generator Matrix Construction

*   **Example 1: The $RM(1,2)$ Code**
    *   **Parameters:** $m=2, r=1$.
    *   **Selection Rule:** Select rows from $G_2^{\otimes 2}$ with weight $\ge 2^{2-1} = 2$.
    *   The matrix $G_2^{\otimes 2}$ has rows with weights (4, 2, 2, 1). We select the first three rows.
    *   $$ G_{RM(1,2)} = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{pmatrix} $$

*   **Example 2: The $RM(1,3)$ Code**
    *   **Parameters:** $m=3, r=1$.
    *   **Selection Rule:** Select rows from $G_2^{\otimes 3}$ with weight $\ge 2^{3-1} = 4$.
    *   The rows of $G_2^{\otimes 3}$ have weights (8, 4, 4, 2, 4, 2, 2, 1). We select the rows with weights 8 and 4. These are the rows with indices 0, 1, 2, and 4.
    *   $$ G_{RM(1,3)} = \begin{pmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \end{pmatrix} $$

*   **Example 3: The $RM(2,3)$ Code**
    *   **Parameters:** $m=3, r=2$.
    *   **Selection Rule:** Select rows from $G_2^{\otimes 3}$ with weight $\ge 2^{3-2} = 2$.
    *   The rows of $G_2^{\otimes 3}$ have weights (8, 4, 4, 2, 4, 2, 2, 1). We select all rows except the last one (which has weight 1). This gives us 7 rows.
    *   $$ G_{RM(2,3)} = \begin{pmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 & 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 \end{pmatrix} $$

*   **Example 4: The $RM(0,m)$ Code (Repetition Code)**
    *   **Parameters:** $m$ is any integer, $r=0$.
    *   **Selection Rule:** Select rows from $G_2^{\otimes m}$ with weight $\ge 2^{m-0} = 2^m$.
    *   Only the first row (the all-ones vector) of $G_2^{\otimes m}$ has this weight.
    *   $$ G_{RM(0,m)} = \begin{pmatrix} 1 & 1 & \cdots & 1 \end{pmatrix} $$

*   **Example 5: The $RM(m,m)$ Code (The full space $\mathbb{F}_2^{2^m}$)**
    *   **Parameters:** $r=m$.
    *   **Selection Rule:** Select rows from $G_2^{\otimes m}$ with weight $\ge 2^{m-m} = 2^0 = 1$.
    *   All non-zero rows of $G_2^{\otimes m}$ have a weight of at least 1. Since the matrix is invertible, all rows are non-zero. Thus, we select all rows.
    *   $$ G_{RM(m,m)} = G_2^{\otimes m} $$

---

### 4. Connection to the Polynomial Definition

This constructive method is perfectly equivalent to the polynomial evaluation definition. The rows of $G_2^{\otimes m}$ are, in fact, the evaluation vectors of all possible monomials of $m$ variables.

The correspondence is as follows: Let the binary representation of the row index $j$ be $(b_1 b_2 \dots b_m)$, where $b_1$ is the most significant bit (MSB). The $j$-th row of $G_2^{\otimes m}$ corresponds to the evaluation vector of the monomial $M_j = \prod_{i=1}^m X_i^{b_i}$. For instance, if $m=3$ and $j=5$, its binary representation is $(101)_2$, so the monomial is $X_1^1 X_2^0 X_3^1 = X_1 X_3$.

The Hamming weight of the evaluation vector for a monomial of degree $d$ is exactly $2^{m-d}$.

Therefore, our row selection rule, `weight` $\ge 2^{m-r}$, can be translated into the polynomial degree:
$$ 
\text{weight}( \text{Eval}(M_j) ) \ge 2^{m-r} \implies 2^{m-d} \ge 2^{m-r} \implies m-d \ge m-r \implies d \le r 
$$
This shows that selecting rows with weight at least $2^{m-r}$ is identical to selecting the basis functions (monomials) of degree at most $r$.

#### Example: Constructing $G_{RM(1,3)}$

*   **Parameters:** $m=3, r=1$.
*   **Selection Rule:** Select rows from $G_2^{\otimes 3}$ with Hamming weight $\ge 2^{3-1} = 4$.

Let's examine the rows of $G_2^{\otimes 3}$ and their corresponding monomials, with $X_1$ as the MSB.

| Row Index ($j$) | Binary Rep. ($b_1b_2b_3$) | Monomial | Hamming Weight | Select? (Weight $\ge 4$) |
| :------------ | :---------- | :------------------------------------------ | :------------- | :----------------------- |
| 0             | 000         | $1$                                         | $8 = 2^{3-0}$  | Yes                      |
| 1             | 001         | $X_3$                                       | $4 = 2^{3-1}$  | Yes                      |
| 2             | 010         | $X_2$                                       | $4 = 2^{3-1}$  | Yes                      |
| 3             | 011         | $X_2X_3$                                    | $2 = 2^{3-2}$  | No                       |
| 4             | 100         | $X_1$                                       | $4 = 2^{3-1}$  | Yes                      |
| 5             | 101         | $X_1X_3$                                    | $2 = 2^{3-2}$  | No                       |
| 6             | 110         | $X_1X_2$                                    | $2 = 2^{3-2}$  | No                       |
| 7             | 111         | $X_1X_2X_3$                                 | $1 = 2^{3-3}$  | No                       |

The selected monomials are $\{1, X_1, X_2, X_3\}$. The generator matrix is formed by taking the rows from $G_2^{\otimes 3}$ with indices 0, 1, 2, and 4, in that specific order.

$$ 
G_{RM(1,3)} = \begin{pmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \end{pmatrix} \begin{matrix} \leftarrow \text{Eval}(1) \\ \leftarrow \text{Eval}(X_3) \\ \leftarrow \text{Eval}(X_2) \\ \leftarrow \text{Eval}(X_1) \end{matrix} 
$$

---

### 5. The Duality of Reed-Muller Codes

A remarkable property of RM codes is that they are *duals* of each other. The dual of a linear code $\mathcal{C}$, denoted $\mathcal{C}^{\perp}$, is the set of all vectors that are orthogonal to every codeword in $\mathcal{C}$. A generator matrix for one code can serve as a parity-check matrix for its dual.

**Theorem:** The dual of the $RM(r, m)$ code is the $RM(m-r-1, m)$ code.
$$ 
[RM(r, m)]^{\perp} = RM(m-r-1, m) 
$$
This implies that a generator matrix for $RM(m-r-1, m)$ is a valid parity-check matrix for $RM(r, m)$. Let $G_r$ be the generator matrix for $RM(r,m)$ and let $H = G_{m-r-1}$ be the generator matrix for $RM(m-r-1,m)$. To prove the duality, we must show that $G_r H^T = \mathbf{0}$.

**Proof:**
This condition is satisfied if the dot product of any row from $G_r$ with any row from $H$ is zero. Let's analyze this using the polynomial representation.
1.  A row in $G_r$ is the evaluation vector $\text{Eval}(f)$ of a basis monomial $f(\mathbf{X})$ where $\text{deg}(f) \le r$.
2.  A row in $H$ is the evaluation vector $\text{Eval}(g)$ of a basis monomial $g(\mathbf{X})$ where $\text{deg}(g) \le m-r-1$.

The dot product of these two vectors is the sum of their component-wise product:
$$ 
\text{Eval}(f) \cdot \text{Eval}(g) = \sum_{\mathbf{v} \in \mathbb{F}_2^m} f(\mathbf{v}) g(\mathbf{v}) = \sum_{\mathbf{v} \in \mathbb{F}_2^m} (f \cdot g)(\mathbf{v}) 
$$
The degree of the product polynomial $p(\mathbf{X}) = f(\mathbf{X})g(\mathbf{X})$ is:
$$ 
\text{deg}(p) = \text{deg}(f) + \text{deg}(g) \le r + (m-r-1) = m-1 
$$
We use a fundamental property of Boolean functions: for any non-zero Boolean polynomial $p(\mathbf{X})$ with degree less than $m$, the sum of its evaluations over all $2^m$ points is zero.
$$ 
\sum_{\mathbf{v} \in \mathbb{F}_2^m} p(\mathbf{v}) = 0 
$$
Since $\text{deg}(p) < m$, the dot product is zero. This holds for any pair of basis vectors (rows), proving the duality.

#### 5.1 Duality Example: The Self-Dual $RM(1,3)$ Code

Let's verify the property $GH^T = \mathbf{0}$ with an example.
*   Consider the code $\mathcal{C} = RM(1,3)$. Here $m=3, r=1$.
*   Its dual is $\mathcal{C}^{\perp} = RM(m-r-1, m) = RM(3-1-1, 3) = RM(1,3)$.
*   This is a **self-dual** code, meaning the code and its dual are identical. Therefore, its generator matrix $G$ can also serve as its parity-check matrix $H$. We must verify that $G G^T = \mathbf{0}$.

From the previous section, the generator matrix is:
$$ 
G = G_{RM(1,3)} = \begin{pmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \end{pmatrix} 
$$
Its transpose is:
$$ 
G^T = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 1 & 0 & 1 & 0 \\ 1 & 1 & 1 & 0 \\ 1 & 0 & 0 & 1 \\ 1 & 1 & 0 & 1 \\ 1 & 0 & 1 & 1 \\ 1 & 1 & 1 & 1 \end{pmatrix} 
$$
Now, we compute the product $G G^T$. Each entry $(i,j)$ of the resulting matrix is the dot product of row $i$ of $G$ with row $j$ of $G$. All calculations are in $\mathbb{F}_2$.
$$ 
G G^T = \begin{pmatrix} 8 & 4 & 4 & 4 \\ 4 & 4 & 2 & 2 \\ 4 & 2 & 4 & 2 \\ 4 & 2 & 2 & 4 \end{pmatrix} \pmod 2 = \begin{pmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix} 
$$
The result is the $4 \times 4$ zero matrix, confirming that the generator matrix for $RM(1,3)$ is a valid parity-check matrix for itself, as expected for a self-dual code.

### 6. Minimum Distance from the Generator Matrix Construction

The recursive construction of the generator matrix provides an elegant way to prove the minimum distance of an $RM(r,m)$ code. We can prove by induction that the minimum Hamming distance is exactly $d_{min} = 2^{m-r}$.

**Theorem:** The minimum distance of the $RM(r,m)$ code is $2^{m-r}$.

**Proof:**
We will use induction on $m$.

**Base Cases:**
1.  For $r=0$, the $RM(0,m)$ code is the repetition code with codewords $\mathbf{0} = (0, \dots, 0)$ and $\mathbf{1} = (1, \dots, 1)$. The minimum distance is the weight of the all-ones vector, which is $2^m$. The formula gives $d_{min} = 2^{m-0} = 2^m$. This holds.
2.  For $r=m$, the $RM(m,m)$ code is the entire space $\mathbb{F}_2^{2^m}$. The minimum distance is 1 (e.g., the codeword $(0, \dots, 0, 1)$). The formula gives $d_{min} = 2^{m-m} = 2^0 = 1$. This also holds.

**Inductive Hypothesis:**
Assume that for all $r' \le m'$, where $m' < m$, the minimum distance of the $RM(r', m')$ code is $2^{m'-r'}$.

**Inductive Step:**
To construct the generator matrix for $RM(r,m)$, we select rows from $G_2^{\otimes m}$. Recall the recursive structure:
$$
G_2^{\otimes m} = \begin{pmatrix} G_2^{\otimes (m-1)} & G_2^{\otimes (m-1)} \\ \mathbf{0} & G_2^{\otimes (m-1)} \end{pmatrix}
$$
The rows of $G_{RM(r,m)}$ can be partitioned into two sets based on this structure:

1.  **Rows from the top block:** These correspond to basis monomials of degree at most $r$ using only the first $m-1$ variables ($X_1, \dots, X_{m-1}$). These are precisely the basis vectors for the $RM(r, m-1)$ code. In the $m$-variable space, these rows have the form $(\mathbf{v} | \mathbf{v})$, where $\mathbf{v}$ is a basis vector of $RM(r, m-1)$. The generator matrix for this part is thus $(G_{RM(r, m-1)} | G_{RM(r, m-1)})$.

2.  **Rows from the bottom block:** These correspond to basis monomials that include the variable $X_m$. They have the form $X_m \cdot M(X_1, \dots, X_{m-1})$, where the degree of $M$ is at most $r-1$. The vectors generated by these monomials are the basis vectors for the $RM(r-1, m-1)$ code, but shifted into the second half of the codeword. These rows have the form $(\mathbf{0} | \mathbf{u})$, where $\mathbf{u}$ is a basis vector of $RM(r-1, m-1)$. The generator matrix for this part is $(\mathbf{0} | G_{RM(r-1, m-1)})$.

Combining these, the generator matrix for $RM(r,m)$ has the following block structure:
$$
G_{RM(r,m)} = \begin{pmatrix} G_{RM(r, m-1)} & G_{RM(r, m-1)} \\ \mathbf{0} & G_{RM(r-1, m-1)} \end{pmatrix}
$$
Now consider an arbitrary non-zero codeword $\mathbf{c} \in RM(r,m)$. It is generated by a message vector, which we can partition as $(\mathbf{a} | \mathbf{b})$, where $\mathbf{a}$ is the part for the top block and $\mathbf{b}$ is for the bottom.

$$
\mathbf{c} = (\mathbf{a} | \mathbf{b}) \cdot G_{RM(r,m)} = (\mathbf{a} G_{RM(r, m-1)} | \mathbf{a} G_{RM(r, m-1)}) + (\mathbf{0} | \mathbf{b} G_{RM(r-1, m-1)})
$$
Let $\mathbf{u} = \mathbf{a} \cdot G_{RM(r, m-1)}$, which is a codeword in $RM(r, m-1)$, and let $\mathbf{v} = \mathbf{b} \cdot G_{RM(r-1, m-1)}$, a codeword in $RM(r-1, m-1)$. The codeword $\mathbf{c}$ can be written as:
$$
\mathbf{c} = (\mathbf{u} | \mathbf{u} + \mathbf{v})
$$
This is the famous Plotkin construction, or $(u|u+v)$ construction. The Hamming weight of $\mathbf{c}$ is $wt(\mathbf{c}) = wt(\mathbf{u}) + wt(\mathbf{u} + \mathbf{v})$. We need to find the minimum possible weight for a non-zero $\mathbf{c}$.

We analyze two cases for the message $(\mathbf{a} | \mathbf{b})$:

*   **Case 1: $\mathbf{b} = \mathbf{0}$ and $\mathbf{a} \neq \mathbf{0}$**
    In this case, $\mathbf{v} = \mathbf{0}$ and $\mathbf{u}$ is a non-zero codeword in $RM(r, m-1)$. The codeword is $\mathbf{c} = (\mathbf{u} | \mathbf{u})$. The weight is $wt(\mathbf{c}) = 2 \cdot wt(\mathbf{u})$. The minimum weight in this case is twice the minimum distance of $RM(r, m-1)$. By our inductive hypothesis, this is:
    $$
    wt_{min, 1} = 2 \cdot d_{min}(RM(r, m-1)) = 2 \cdot (2^{(m-1)-r}) = 2^{m-r}
    $$

*   **Case 2: $\mathbf{b} \neq \mathbf{0}$**
    In this case, $\mathbf{v}$ is a non-zero codeword in $RM(r-1, m-1)$. Since $\mathbf{v}$ and $\mathbf{u}+\mathbf{v}$ are vectors in a linear code, their sum $\mathbf{v}+(\mathbf{u}+\mathbf{v}) = \mathbf{u}$ is also in a linear space. The weight of the codeword is $wt(\mathbf{c}) = wt(\mathbf{u}) + wt(\mathbf{u} + \mathbf{v})$. It is known from the properties of the $(u|u+v)$ construction that the weight of any such codeword is at least the minimum distance of the code that produces the $\mathbf{v}$ part.
    More directly, the minimum weight of $\mathbf{v}$ is the minimum distance of $RM(r-1, m-1)$. By our inductive hypothesis:
    $$
    wt(\mathbf{v}) \ge d_{min}(RM(r-1, m-1)) = 2^{(m-1)-(r-1)} = 2^{m-r}
    $$
    Since the second half of the codeword $\mathbf{c}$ is $\mathbf{u}+\mathbf{v}$, its weight is $wt(\mathbf{u}+\mathbf{v})$. The total weight is $wt(\mathbf{c}) = wt(\mathbf{u}) + wt(\mathbf{u}+\mathbf{v})$. The codewords form a linear code, so the minimum distance is the minimum weight of any non-zero codeword. For any codeword where $\mathbf{v} \ne 0$, its weight is at least $d_{min}(RM(r-1, m-1)) = 2^{m-r}$.

Combining both cases, the minimum weight of any non-zero codeword is the minimum of the minimums from each case:
$$
d_{min}(RM(r,m)) = \min(2^{m-r}, 2^{m-r}) = 2^{m-r}
$$
The induction holds, and the proof is complete.