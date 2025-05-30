import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components';

import { CheckCircle, Mail, User, Calendar, Ruler, Weight } from 'lucide-react';

const profileData = {
  status: 'success',
  data: {
    userId: 'user123',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    profilePictureData: null,
    profilePictureMimeType: 'image/jpeg',
    age: 25,
    height: 175,
    weight: 70,
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-15T08:00:00Z',
  },
};

export default function ProfileDashboard() {
  const { data } = profileData;

  // Get initials from name for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const profileImageUrl = data.profilePictureData ? `data:${data.profilePictureMimeType};base64,${data.profilePictureData}` : null;

  return (
    <div className="container mx-auto px-4 py-10 lg:py-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImageUrl || undefined} alt={data.name} />
                <AvatarFallback className="text-lg font-semibold">{getInitials(data.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <h1 className="text-2xl font-bold">{data.name}</h1>
                  {data.isVerified && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-2 text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{data.email}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground sm:justify-start">
                  <User className="h-4 w-4" />
                  <span>User ID: {data.userId}</span>
                </div>
              </div>

              <Badge variant="outline" className="capitalize">
                {data.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Information Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{data.age} years old</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center space-x-1">
                  <Ruler className="h-4 w-4" />
                  <span>Height</span>
                </span>
                <span className="font-medium">{data.height} cm</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center space-x-1">
                  <Weight className="h-4 w-4" />
                  <span>Weight</span>
                </span>
                <span className="font-medium">{data.weight} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <Badge variant={data.isVerified ? 'default' : 'secondary'}>{data.isVerified ? 'Verified' : 'Unverified'}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{data.role}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{formatDate(data.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Picture Information */}
        {data.profilePictureData && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Image Type</span>
                <span className="font-medium">{data.profilePictureMimeType}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
