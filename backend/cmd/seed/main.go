package main

import (
	"fmt"
	"log"
	"office-seat-allocation/backend/internal/config"
	"office-seat-allocation/backend/internal/database"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/utils"
	"time"
)

var firstNames = []string{"James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa", "Timothy", "Deborah"}
var lastNames = []string{"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"}

func main() {
	config.Load()

	if err := database.Connect(config.AppConfig.DatabaseURL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations first
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("🌱 Seeding database...")

	// Create admin user
	hash, _ := utils.HashPassword("admin123")
	admin := &models.Employee{
		Email:        "admin@example.com",
		Name:         "Admin User",
		PasswordHash: hash,
		Role:         utils.RoleAdmin,
		Status:       utils.StatusActive,
	}

	if err := database.DB.Create(admin).Error; err != nil {
		log.Println("⚠️  Admin user already exists")
	} else {
		log.Println("✅ Admin user created: admin@example.com / admin123")
	}

	// Create 5 teams with managers
	teams := []struct {
		Name        string
		Description string
		ManagerName string
		ManagerEmail string
	}{
		{"Engineering", "Software Engineering Team", "Sarah Johnson", "sarah.johnson@example.com"},
		{"Product", "Product Management Team", "Michael Brown", "michael.brown@example.com"},
		{"Design", "Design and UX Team", "Emily Davis", "emily.davis@example.com"},
		{"Marketing", "Marketing and Sales Team", "David Wilson", "david.wilson@example.com"},
		{"Operations", "Operations and Support Team", "Jennifer Martinez", "jennifer.martinez@example.com"},
	}

	managerHash, _ := utils.HashPassword("manager123")
	employeeHash, _ := utils.HashPassword("password123")

	employeeCount := 0
	for i, teamData := range teams {
		// Create team
		team := &models.Team{
			Name:        teamData.Name,
			Description: teamData.Description,
		}

		if err := database.DB.Create(team).Error; err != nil {
			log.Printf("⚠️  Team %s already exists\n", teamData.Name)
			continue
		}

		// Create manager/team lead
		manager := &models.Employee{
			Email:        teamData.ManagerEmail,
			Name:         teamData.ManagerName,
			PasswordHash: managerHash,
			TeamID:       &team.ID,
			Role:         utils.RoleManager,
			Status:       utils.StatusActive,
		}

		if err := database.DB.Create(manager).Error; err != nil {
			log.Printf("⚠️  Manager %s already exists\n", teamData.ManagerName)
		} else {
			employeeCount++
			// Update team with team lead
			team.TeamLeadID = &manager.ID
			database.DB.Save(team)
		}

		// Create 10 employees per team (50 total)
		for j := 0; j < 10; j++ {
			firstName := firstNames[(i*10+j)%len(firstNames)]
			lastName := lastNames[(i*10+j)%len(lastNames)]
			name := fmt.Sprintf("%s %s", firstName, lastName)
			email := fmt.Sprintf("%s.%s@example.com", 
				fmt.Sprintf("%s", firstName),
				fmt.Sprintf("%s", lastName))

			employee := &models.Employee{
				Email:        email,
				Name:         name,
				PasswordHash: employeeHash,
				TeamID:       &team.ID,
				Role:         utils.RoleEmployee,
				Status:       utils.StatusActive,
			}

			if err := database.DB.Create(employee).Error; err == nil {
				employeeCount++
			}
		}

		log.Printf("✅ Team '%s' created with manager %s\n", teamData.Name, teamData.ManagerName)
	}

	log.Printf("\n🎉 Seed completed: %d employees across 5 teams\n", employeeCount)

	// Create office capacity (Monday-Friday)
	log.Println("\n🏢 Creating office capacity...")
	for day := 1; day <= 5; day++ {
		capacity := &models.OfficeCapacity{
			DayOfWeek:     day,
			TotalSeats:    40, // 40 seats per day (for 56 employees, ~70% capacity)
			ReservedSeats: 0,
			EffectiveFrom: time.Now().AddDate(0, 0, -30), // Effective from 30 days ago
		}
		if err := database.DB.Create(capacity).Error; err != nil {
			log.Printf("⚠️  Capacity for day %d already exists\n", day)
		} else {
			log.Printf("✅ Capacity for day %d: %d seats\n", day, capacity.TotalSeats)
		}
	}

	log.Println("\n📝 Test Credentials:")
	log.Println("   Admin: admin@example.com / admin123")
	log.Println("   Managers: [manager-email] / manager123")
	log.Println("   Employees: [employee-email] / password123")
}
