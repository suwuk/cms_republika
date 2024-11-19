require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// const HapiRBAC = require('hapi-rbac');
const mapRoleIdToRoleName = require('./utils/mapRoleIdToRoleName');
// news
const news = require('./api/news');
const NewsService = require('./services/postgres/NewsService');
// const NewsService = require('./services/mongodb/NewsService');
const NewsValidator = require('./validator/news');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// categories
const categories = require('./api/categories');
const CategoriesService = require('./services/postgres/CategoriesService');
const CategoriesValidator = require('./validator/categories');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// menus
const menus = require('./api/menu');
const MenuService = require('./services/postgres/MenuService');
const MenuValidator = require('./validator/menu');

// tags
const tags = require('./api/tags');
const TagsService = require('./services/postgres/TagsService');
const TagsValidator = require('./validator/tags');

// comments
const comments = require('./api/comments');
const CommentsService = require('./services/postgres/CommentsService');
const CommentsValidator = require('./validator/comments');

const LogService = require('./services/postgres/LogService');

const ClientError = require('./exceptions/ClientError');

// media
const media = require('./api/media');
const MediaService = require('./services/postgres/MediaService');
const MediaValidator = require('./validator/media');

const menuroles = require('./api/menuroles');
const MenuRolesService = require('./services/postgres/MenuRolesService');
const MenuRolesValidator = require('./validator/menuroles');

// news tags
const newstags = require('./api/newstag');
const NewsTagService = require('./services/postgres/NewsTagService');
const NewsTagValidator = require('./validator/newstag');

const init = async () => {
  const newsService = new NewsService();
  const usersService = new UsersService();
  const categoriesService = new CategoriesService();
  const authenticationsService = new AuthenticationsService();
  const menuService = new MenuService();
  const tagsService = new TagsService();
  const commentsService = new CommentsService();
  const logService = new LogService();
  const mediaService = new MediaService();
  const menuRolesService = new MenuRolesService();
  const newsTagService = new NewsTagService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('cms_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => {
      const roleName = mapRoleIdToRoleName(artifacts.decoded.payload.role_id);
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.user_id,
          username: artifacts.decoded.payload.username,
          fullname: artifacts.decoded.payload.fullname,
          email: artifacts.decoded.payload.email,
          role_id: artifacts.decoded.payload.role_id,
          roles: roleName,
        },
      };
    },
  });

  await server.register([
    {
      plugin: news,
      options: {
        service: newsService,
        logService,
        validator: NewsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: categories,
      options: {
        service: categoriesService,
        logService,
        validator: CategoriesValidator,
      },
    },
    {
      plugin: menus,
      options: {
        service: menuService,
        logService,
        validator: MenuValidator,
      },
    },
    {
      plugin: tags,
      options: {
        service: tagsService,
        logService,
        validator: TagsValidator,
      },
    },
    {
      plugin: comments,
      options: {
        service: commentsService,
        logService,
        validator: CommentsValidator,
      },
    },
    {
      plugin: media,
      options: {
        service: mediaService,
        logService,
        validator: MediaValidator,
      },
    },
    {
      plugin: menuroles,
      options: {
        service: menuRolesService,
        logService,
        validator: MenuRolesValidator,
      },
    },
    {
      plugin: newstags,
      options: {
        service: newsTagService,
        logService,
        validator: NewsTagValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
