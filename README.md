# Microservice Deployment Using Virtual Machines (Ubuntu 24.04 LTS)

This repository demonstrates the deployment of a simple microservice-based application across two lightweight virtual machines using **VirtualBox** and **Ubuntu 24.04 LTS**. The objective is to understand VM creation, networking, and inter-service communication in a minimal, controlled environment.

---

## 📌 Project Overview

The system consists of two virtual machines:

* **Server VM**: Hosts a Node.js REST API
* **Client VM**: Consumes the API using HTTP requests

Both VMs are connected using a **VirtualBox Internal Network** for service-to-service communication, while **NAT networking** is used only for internet access (package installation).

---

## 🖥️ Virtual Machine Roles

### Server VM

* OS: Ubuntu 24.04 LTS
* Role: API Provider
* Service: Node.js REST API (Express)
* Internal IP: `192.168.56.10`
* Port: `3000`

### Client VM

* OS: Ubuntu 24.04 LTS
* Role: API Consumer
* Service: Node.js client (Axios)
* Internal IP: `192.168.56.11`

---

## 🏗️ Architecture Design

The following diagram illustrates the connection between the host machine, the two virtual machines, and the communication flow between the microservices.

```mermaid
flowchart LR
    %% ================= HOST =================
    subgraph Host["🖥️ Host Machine (macOS)"]
        VB["VirtualBox Hypervisor"]
    end

    %% ================= NETWORKS =================
    subgraph Networks["🌐 Virtual Networks"]
        NAT["NAT Network\n(Internet Access)"]
        INT["Internal Network\nmicro_net"]
    end

    %% ================= BACKEND VM =================
    subgraph BackendVM["🟢 Backend VM (Ubuntu Linux)"]
        BETH0["eth0 (NAT)\nInternet"]
        BETH1["eth1 (Internal)\n192.168.56.10"]
        BackendService["Node.js + Express\nBackend Service\nPort: 3000"]
        API["REST API\nGET /users"]
    end

    %% ================= CLIENT VM =================
    subgraph ClientVM["🔵 Client VM (Ubuntu Linux)"]
        CETH0["eth0 (NAT)\nInternet"]
        CETH1["eth1 (Internal)\n192.168.56.11"]
        ClientService["Node.js Client\nAxios HTTP Requests"]
    end

    %% ================= HOST → VMs =================
    VB --> BackendVM
    VB --> ClientVM

    %% ================= NETWORK LINKS =================
    BETH0 --> NAT
    CETH0 --> NAT

    BETH1 --> INT
    CETH1 --> INT

    %% ================= INTERNAL DATA FLOW =================
    ClientService -- "HTTP Request\n/users" --> API
    API -- "JSON Response\nUser Data" --> ClientService

    %% ================= INTERNAL VM STRUCTURE =================
    BackendService --> API
    BackendVM --> BackendService
    ClientVM --> ClientService

    %% ================= INTERNET USAGE =================
    NAT -.->|"npm install\nOS updates"| Internet

```

![Architecture Diagram](architecture/architecture.png)

---

## 🌐 Networking Details

* **eth0 (NAT)**
  * Used for internet access
  * Required for installing Node.js and npm packages

* **eth1 (Internal Network)**
  * Used for VM-to-VM communication
  * No DHCP server available
  * Static IP addresses were manually assigned

This separation ensures that internal microservice communication remains isolated from external networks.

---

## 🚀 Microservice Implementation

### API Service (Server VM)

* Built using **Node.js** and **Express**
* Exposes a single endpoint:
  
  ```
  GET /api
  ```
* Returns a JSON response
* Binds to `0.0.0.0` to allow access from other VMs

### Client Service (Client VM)

* Built using **Node.js** and **Axios**
* Sends an HTTP request to the server’s internal IP
* Prints the response received from the API

---

## ▶️ How to Run the Services

### On the Server VM

```bash
cd api-service
npm install
node index.js
```

Expected output:

```
API running on port 3000
```

---

### On the Client VM

```bash
cd client-service
npm install
node client.js
```

Expected output:

```
Response from server: { message: 'Hello from Server VM API' }
```

---

## 🧪 Key Challenges Faced

* Network interfaces were initially down and required manual initialization
* Incorrect repository configuration caused package installation failures
* Internal Network did not provide DHCP, requiring static IP configuration
* Ubuntu booted into live mode until the installer ISO was removed
* API initially bound to `localhost`, preventing external VM access

Each issue was diagnosed using system tools (`ip a`, `udhcpc`, repository checks) and resolved incrementally.

---

## 📂 Repository Structure

```
vm-microservice-alpine/
├── api-service/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│   
├── client-service/
│   ├── client.js
│   ├── package.json
│   └── package-lock.json
│   
├── architecture/
│   └── architecture.mmd
│   
└── README.md
```

---

## ✅ Conclusion

This project demonstrates how lightweight virtual machines can be used to deploy and connect microservices without relying on heavy orchestration tools. By resolving real-world setup and networking issues, the assignment provided practical insight into virtualization, networking, and service deployment.
