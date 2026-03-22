let leads = [];

if (localStorage.getItem("leads")) {
    leads = JSON.parse(localStorage.getItem("leads"));
    renderLeads();
    updateMetrics();
}

function addLead() {
    const name = document.getElementById("lead-name").value.trim();
    const company = document.getElementById("lead-company").value.trim();
    const email = document.getElementById("lead-email").value.trim();
    const status = document.getElementById("lead-status").value;
    
    if (!name || !company || !email) {
        alert("Please fill in all lead fields.");
        return;
    }

    const lead = {
        id: Date.now(),
        name,
        company,
        email,
        status
    };

    leads.push(lead);
    localStorage.setItem("leads", JSON.stringify(leads));
    renderLeads();
    updateMetrics();
    document.getElementById("lead-form").reset();
}

function renderLeads() {
    const tbody = document.getElementById("lead-table").querySelector("tbody");
    tbody.innerHTML = "";

    leads.forEach((lead) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${lead.name}</td>
          <td>${lead.company}</td>
          <td>${lead.email}</td>
          <td>
            <select onchange="updateLeadStatus(${lead.id}, this.value)">
              <option value="New" ${lead.status === "New" ? "selected" : ""}>New</option>
              <option value="Contacted" ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
              <option value="Qualified" ${lead.status === "Qualified" ? "selected" : ""}>Qualified</option>
              <option value="Closed" ${lead.status === "Closed" ? "selected" : ""}>Closed</option>
            </select>
          </td>
          <td><buttton onclick="deleteLead(${lead.id})">Delete<button></td>
         `;

         tbody.appendChild(tr);
       });
}

function updateLeadStatus(id, newStatus) {
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = newStatus; 
    localStorage.setItem("leads", JSON.stringify(leads));
    renderLeads();
    updateMetrics();
  }
}

function deleteLead(id) {
    if (confirm("Are you sure you want to delete this lead?" )) {
       leads = leads.filter((lead) => lead.id !== id);
       localStorage.setItem("leads", JSON.stringify(leads));
       renderLeads();
       updateMetrics();
    }
}

function calculateRevenue() {

    const numleads = parseFloat(document.getElementById("calc-leads").value) || 0;
    const dealSize = parseFloat(document.getElementById("calc-deal-size").value) || 0;
    const conversion = parseFloat(document.getElementById("calc-conversion").value) || 0;
    const revenue = numleads * (conversion / 100) * dealSize;
    
    document.getElementById("calc-result").textContent = "Estimated Revenue: $" + revenue.toFixed(2);
}

function updateMetrics() {
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => lead.status === "Qualified").length;
    const closedDeals = leads.filter(lead => lead.status === "Closed").length;
    const avgDealSize = 1000;
    const estimatedRevenue = closedDeals * avgDealSize;

    document.getElementById("total-leads").innerText = totalLeads;
    document.getElementById("qualified-leads").innerText = qualifiedLeads;
    document.getElementById("closed-deals").innerText = closedDeals;
    document.getElementById("estimated-revenue").innerText = "$" + estimatedRevenue;
}