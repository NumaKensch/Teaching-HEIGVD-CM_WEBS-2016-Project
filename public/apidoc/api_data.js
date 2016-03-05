define({ "api": [
  {
    "type": "post",
    "url": "/issuesTypes",
    "title": "Add a type of issue",
    "name": "addIssueType",
    "group": "IssueType",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameShort",
            "description": "<p>nameShort of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the IssueType.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/issueType.js",
    "groupTitle": "IssueType"
  },
  {
    "type": "delete",
    "url": "//:idIssueType",
    "title": "Delete a issueType information",
    "name": "deleteIssueType",
    "group": "IssueType",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>IssueType unique ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IssueTypeNotFound",
            "description": "<p>The id of the IssueType was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"IssueTypeNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/issueType.js",
    "groupTitle": "IssueType"
  },
  {
    "type": "get",
    "url": "/issuesTypes/:idIssu",
    "title": "Request a issueType information",
    "name": "GetIssueType",
    "group": "IssuesTypes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameShort",
            "description": "<p>nameShort of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p>Version of the IssueType.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"_id\": \"56d01204fc5887801256e80e\",\n   \"nameShort\": \"cassé\",\n   \"description\": \"poteau\",\n   \"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IssueTypeNotFound",
            "description": "<p>The id of the IssueType was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"IssueTypeNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/issueType.js",
    "groupTitle": "IssuesTypes"
  },
  {
    "type": "get",
    "url": "/issuesTypes",
    "title": "Request issuesTypes information",
    "name": "GetIssuesTypes",
    "group": "IssuesTypes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nameShort",
            "description": "<p>nameShort of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the IssueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p>Version of the IssueType.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"_id\": \"56d01204fc5887801256e80e\",\n   \"nameShort\": \"cassé\",\n   \"description\": \"poteau\",\n   \"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IssueTypeNotFound",
            "description": "<p>The id of the IssueType was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"IssueTypeNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/issueType.js",
    "groupTitle": "IssuesTypes"
  },
  {
    "type": "get",
    "url": "/:idUser/issue",
    "title": "Get the list of the issues raised by a user",
    "name": "GetIssuesRaisedByUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Issue unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Users unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p>version of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "optional": true,
            "field": "Object[]",
            "description": "<p>keyWords       KeyWords of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "keyWords.word",
            "description": "<p>the word.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "keyWords.id",
            "description": "<p>Id of the word.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "action",
            "description": "<p>action of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "action.staffId",
            "description": "<p>Id of the action's staff.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "action.date",
            "description": "<p>Date of the action.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "action.description",
            "description": "<p>Description of action.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "action.id",
            "description": "<p>Id of the action.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "issueType",
            "description": "<p>IssueType of the issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "issueType.issueTypeId",
            "description": "<p>Id of the issueType.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "issueType.type",
            "description": "<p>Type of the issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "coordinate",
            "description": "<p>Coordinate of the Issue.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "coordinate.type",
            "description": "<p>Type of the coordinate.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "coordinate.coordinates",
            "description": "<p>Coordinates with longitude and latitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n  \"_id\": \"56d024b7f3b5d46815091085\",\n  \"author\": \"56cf02994217783c3712280c\",\n  \"description\": \"boum\",\n  \"status\": \"boum\",\n \"__v\": 0,\n  \"keyWords\": [\n    {\n      \"word\": \"boum\",\n      \"_id\": \"56d024b7f3b5d46815091086\"\n    }\n  ],\n  \"action\": [\n    {\n      \"staffId\": \"56cf02994217783c3712280c\",\n      \"date\": \"2015-12-02T00:00:00.000Z\",\n      \"description\": \"boum\",\n      \"_id\": \"56d024b7f3b5d46815091087\"\n    }\n  ],\n  \"issueType\": {\n    \"issueTypeId\": \"56d01204fc5887801256e80e\",\n    \"type\": \"boum\"\n  },\n \"coordinate\": {\n    \"type\": \"boum\",\n    \"coordinates\": [\n      1236\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Request User information",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "role",
            "description": "<p>role of the User (star or citizen or both).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"name\": {\n   \"first\": \"Jean\",\n   \"last\": \"Dupont\"\n},\n \"role\":[\"citizen\", \"staff\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Request User information",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "role",
            "description": "<p>role of the User (star or citizen or both).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"name\": {\n   \"first\": \"Jean\",\n   \"last\": \"Dupont\"\n},\n \"role\":[\"citizen\", \"staff\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users?page={integer}&pageSize={integer}",
    "title": "Request User information per page and check size.",
    "name": "GetUserPerPageAndSize",
    "group": "User",
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/:idUser/role",
    "title": "Add the role staff to a user",
    "name": "addRoleStaff",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "role",
            "description": "<p>role of the User (star or citizen or both).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/users/:idUser/role",
    "title": "Delete the role staff to a user",
    "name": "deleteRoleStaff",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Delete User information",
    "name": "deleteUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Add a user",
    "name": "addUser",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "role",
            "description": "<p>role of the User (star or citizen or both).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/user.js",
    "groupTitle": "Users"
  }
] });