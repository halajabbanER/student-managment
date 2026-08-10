function StudentFilter({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  levelFilter,
  setLevelFilter,
}) {
  return (
    <div className="student-filters">
      <input
        type="text"
        placeholder="Search by name, email or ID..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <select
        value={departmentFilter}
        onChange={(event) => setDepartmentFilter(event.target.value)}
      >
        <option value="All">All Departments</option>
        <option value="Computer Engineering">Computer Engineering</option>
        <option value="Software Engineering">Software Engineering</option>
        <option value="Electrical Engineering">Electrical Engineering</option>
        <option value="Civil Engineering">Civil Engineering</option>
      </select>

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Graduated">Graduated</option>
      </select>

      <select
        value={levelFilter}
        onChange={(event) => setLevelFilter(event.target.value)}
      >
        <option value="All">All Levels</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>
    </div>
  );
}

export default StudentFilter;
