postgres:
	docker run --name leonardo-ai -e POSTGRES_PASSWORD=postgres -p 5432:5432 --rm -d postgres:alpine

migrations:
	npx prisma db push