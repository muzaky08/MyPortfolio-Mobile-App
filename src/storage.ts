import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAYS_OF_WEEK } from './constants/days';

export type ProfileData = {
  name: string;
  email: string;
  address: string;
  about: string;
  photo: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  github: string;
};

export type EducationItem = {
  id: string;
  level: string;
  schoolName: string;
  years: string;
  location: string;
};

export type ActivityItem = {
  id: string;
  day: string;
  task: string;
};

export type AppData = {
  profile: ProfileData;
  skills: string[];
  education: EducationItem[];
  activities: ActivityItem[];
};

export const STORAGE_KEY = '@myportfolio_app_data';

export const defaultProfileData: ProfileData = {
  name: 'Muhamad Zaky Nurfaiz',
  email: 'muzakynf@gmail.com',
  address: 'Tangerang, Indonesia',
  about:
    'Mahasiswa aktif Program Studi Ilmu Komputer di Universitas Yatsi Madani. Saat ini fokus pada pengembangan aplikasi mobile dengan React Native, membangun portofolio digital, dan menyelesaikan tugas akhir mata kuliah Pemrograman Mobile dengan banyaknya drama yang sudah dilalui.',
  photo: '',
  whatsapp: 'https://wa.me/6285890275879',
  instagram: 'https://instagram.com/moezaky.nf/',
  linkedin: 'https://www.linkedin.com/in/zaky-nurfaiz-7a0703338?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  github: 'https://github.com/muzaky08',
};

export const defaultSkills = ['React Native', 'JavaScript', 'TypeScript', 'UI/UX', 'Problem Solving'];

export const defaultEducation: EducationItem[] = [
  { id: '1', level: 'SD/MI', schoolName: 'MI MA Klebet II', years: '2009 - 2015', location: 'Kemiri, Kab. Tangerang' },
  { id: '2', level: 'SMP/MTS', schoolName: 'MTS Daarul Hikmah', years: '2016 - 2018', location: 'Sukadiri, Kab. Tangerang' },
  { id: '3', level: 'SMA/SMK', schoolName: 'SMA Nusantara Unggul', years: '2019 - 2021', location: 'Sukadiri, Kab. Tangerang' },
  { id: '4', level: 'S1/D4', schoolName: 'Universitas Yatsi Madani', years: '2023 - Sekarang', location: 'Karawaci, Kab. Tangerang' },
];

export const defaultActivities: ActivityItem[] = [
  { id: '1', day: 'Senin', task: 'Bangun pagi dan olahraga ringan' },
  { id: '2', day: 'Senin', task: 'Mengikuti kelas pemrograman mobile' },
  { id: '3', day: 'Selasa', task: 'Praktikum di laboratorium komputer' },
  { id: '4', day: 'Rabu', task: 'Belajar project dan menulis dokumentasi' },
  { id: '5', day: 'Kamis', task: 'Review materi dan latihan coding' },
  { id: '6', day: 'Jumat', task: 'Presentasi progress tugas akhir' },
  { id: '7', day: 'Sabtu', task: 'Mengerjakan portofolio dan desain UI' },
  { id: '8', day: 'Minggu', task: 'Istirahat dan evaluasi mingguan' },
];

function migrateActivities(activities: ActivityItem[]): ActivityItem[] {
  return activities.map((item, index) => ({
    ...item,
    day: item.day || DAYS_OF_WEEK[index % DAYS_OF_WEEK.length],
  }));
}

function migrateEducation(education: EducationItem[]): EducationItem[] {
  if (education.length >= 4) {
    return education;
  }
  const hasCombined = education.some((e) => e.level === 'SMP/SMA');
  if (hasCombined) {
    return defaultEducation;
  }
  return education;
}

function createDefaultData(): AppData {
  return {
    profile: defaultProfileData,
    skills: defaultSkills,
    education: defaultEducation,
    activities: defaultActivities,
  };
}

export async function loadAppData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultData();
    }
    const parsed = JSON.parse(raw) as AppData;
    return {
      profile: { ...defaultProfileData, ...parsed.profile, about: parsed.profile?.about || defaultProfileData.about },
      skills: parsed.skills?.length ? parsed.skills : defaultSkills,
      education: migrateEducation(parsed.education ?? defaultEducation),
      activities: migrateActivities(parsed.activities ?? defaultActivities),
    };
  } catch (error) {
    console.log('Failed to load app data:', error);
    return createDefaultData();
  }
}

export async function saveAppData(data: AppData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log('Failed to save app data:', error);
    throw error;
  }
}
