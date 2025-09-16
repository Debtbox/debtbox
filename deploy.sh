#!/bin/bash

# Debtbox Docker Deployment Script
# Usage: ./deploy.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Function to get docker-compose command
get_compose_cmd() {
    if docker compose version &> /dev/null; then
        echo "docker compose"
    else
        echo "docker-compose"
    fi
}

# Function to deploy development environment
deploy_dev() {
    print_status "Starting development environment..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD --profile dev up -d --build
    print_success "Development environment started!"
    print_status "Application is available at: http://localhost:5173"
    print_status "To view logs: $COMPOSE_CMD --profile dev logs -f"
}

# Function to deploy production environment
deploy_prod() {
    print_status "Starting production environment..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD --profile prod up -d --build
    print_success "Production environment started!"
    print_status "Application is available at: http://localhost"
    print_status "To view logs: $COMPOSE_CMD --profile prod logs -f"
}

# Function to deploy with SSL
deploy_ssl() {
    if [ ! -d "ssl" ]; then
        print_error "SSL directory not found. Please create ssl/ directory and add your certificates."
        print_status "Expected files: ssl/cert.pem, ssl/key.pem"
        exit 1
    fi
    
    print_status "Starting production environment with SSL..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD --profile ssl up -d --build
    print_success "Production environment with SSL started!"
    print_status "Application is available at: https://localhost"
    print_status "To view logs: $COMPOSE_CMD --profile ssl logs -f"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD --profile dev down 2>/dev/null || true
    $COMPOSE_CMD --profile prod down 2>/dev/null || true
    $COMPOSE_CMD --profile ssl down 2>/dev/null || true
    print_success "All services stopped!"
}

# Function to restart services
restart_services() {
    print_status "Restarting services..."
    stop_services
    sleep 2
    deploy_prod
}

# Function to show logs
show_logs() {
    COMPOSE_CMD=$(get_compose_cmd)
    if [ "$2" = "dev" ]; then
        $COMPOSE_CMD --profile dev logs -f
    elif [ "$2" = "prod" ]; then
        $COMPOSE_CMD --profile prod logs -f
    elif [ "$2" = "ssl" ]; then
        $COMPOSE_CMD --profile ssl logs -f
    else
        print_status "Showing logs for all profiles..."
        $COMPOSE_CMD --profile dev logs -f 2>/dev/null || true
        $COMPOSE_CMD --profile prod logs -f 2>/dev/null || true
        $COMPOSE_CMD --profile ssl logs -f 2>/dev/null || true
    fi
}

# Function to show status
show_status() {
    print_status "Docker containers status:"
    docker ps --filter "name=debtbox" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    print_status "\nDocker images:"
    docker images --filter "reference=debtbox*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        stop_services
        docker system prune -a -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Debtbox Docker Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment (port 5173)"
    echo "  prod        Start production environment (port 80)"
    echo "  ssl         Start production environment with SSL (port 443)"
    echo "  stop        Stop all services"
    echo "  restart     Restart production services"
    echo "  logs [env]  Show logs (dev|prod|ssl)"
    echo "  status      Show container and image status"
    echo "  cleanup     Remove all containers, images, and volumes"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev              # Start development"
    echo "  $0 prod             # Start production"
    echo "  $0 logs dev         # Show development logs"
    echo "  $0 status           # Show status"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "dev")
            deploy_dev
            ;;
        "prod")
            deploy_prod
            ;;
        "ssl")
            deploy_ssl
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            show_logs "$@"
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
