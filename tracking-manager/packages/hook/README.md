# Golang API

API structure follow up `Clean Architecture` and [DAO design pattern](https://gorm.io/gen/index.html) (GORM recommend)

## Table Of Content

- [Folder Structure Pattern](#folder-structure-pattern)

## Folder Structure Pattern

```
├── api // controller layer
│   └── {api endpoint}
│   │     └── create.go // POST method
│   │     └── update.go // PUT method
│   │     └── delete.go // DELETE method
│   │     └── index.go // GET method
│   │     └── search.go // POST search method
│   │     └── read.go // Get by Id method
└── models
└── pkg
│   └── database  
│   └── rabbitmq  
└── server
│   └── route
└── statics // Constant
```
