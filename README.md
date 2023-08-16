# Introduction 

- **Bayesian Network**
    
  A **Bayesian network**, also known as a belief network or a probabilistic graphical model, is a powerful tool for representing and reasoning about uncertain knowledge. It consists of a directed acyclic graph (DAG) where nodes represent random variables and edges represent probabilistic dependencies between variables. Each node in the network corresponds to a probability distribution over its own value, conditioned on the values of its parents in the graph.
  
  Bayesian networks provide an intuitive and compact way to model complex systems by capturing the conditional dependencies between variables. They are widely used in various fields, including machine learning, artificial intelligence, and decision analysis, to model uncertain events and make predictions based on available evidence.
  
  Probability modeling is the process of constructing a Bayesian network by specifying the conditional probability distributions for each node given its parents. This involves eliciting expert knowledge or using statistical methods to estimate the probabilities based on available data.


- **D-Separation**
  
  **D-Separation**, short for dependence separation, is a concept in Bayesian networks that helps determine the conditional independence relationships between sets of variables. It is a graphical criterion based on the structure of the network and can be used to infer the absence or presence of probabilistic dependencies between variables
  
  **D-Separation** is particularly useful for reasoning and performing probabilistic inference in Bayesian networks. By identifying d-separated sets of nodes, we can determine whether certain variables are conditionally independent given a set of observed variables.

# Show Cases

You can see an example that demonstrates the relationship and dependencies between low pressure, rain, and traffic, based on the provided evidence.

## Casual Chain

<div align="center" style="display:flex">
<h3>No Evidence</h3>
  
![image](https://github.com/Arash1381-y/d-separation/assets/79264867/2c7ea45d-4037-469e-92f0-00411ebb88f7)

![image](https://github.com/Arash1381-y/d-separation/assets/79264867/6beb3e17-75a2-4b0e-9fda-9de7a8b5311a)


</div>

<div align="center" style="display:flex">
  <h3>Rain As Evidence</h3>

![image](https://github.com/Arash1381-y/d-separation/assets/79264867/71d07e8c-98f1-4385-85bb-b17727fe0629)

![image](https://github.com/Arash1381-y/d-separation/assets/79264867/98846d56-af40-4946-8ad4-9d0ebf381a67)

</div>

# Contirbution

Contributions are welcome! Please feel free to submit a Pull Request.


