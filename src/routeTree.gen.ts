import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ProfileRouteImport } from './routes/profile'
import { Route as PlaygroundRouteImport } from './routes/playground'
import { Route as OnboardingRouteImport } from './routes/onboarding'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as AuthRouteImport } from './routes/auth'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as CoursesIndexRouteImport } from './routes/courses.index'
import { Route as CoursesPathIdRouteImport } from './routes/courses.$pathId'
import { Route as LessonPathIdLessonIdRouteImport } from './routes/lesson.$pathId.$lessonId'

const rootRoute = rootRouteImport
const IndexRoute = IndexRouteImport
const ProfileRoute = ProfileRouteImport
const PlaygroundRoute = PlaygroundRouteImport
const OnboardingRoute = OnboardingRouteImport
const DashboardRoute = DashboardRouteImport
const AuthRoute = AuthRouteImport
const AdminRoute = AdminRouteImport
const CoursesIndexRoute = CoursesIndexRouteImport
const CoursesPathIdRoute = CoursesPathIdRouteImport
const LessonPathIdLessonIdRoute = LessonPathIdLessonIdRouteImport

export const routeTree = rootRoute._addFileChildren({
  IndexRoute,
  AdminRoute,
  AuthRoute,
  DashboardRoute,
  OnboardingRoute,
  PlaygroundRoute,
  ProfileRoute,
  CoursesPathIdRoute,
  CoursesIndexRoute,
  LessonPathIdLessonIdRoute,
})
