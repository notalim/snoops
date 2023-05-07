export function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const EARTH_RADIUS = 6371; // Earth's radius in km

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
            Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS * c;
    return distance;
}

export function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    if (age === 0) {
        const monthAge = today.getMonth() - dob.getMonth();
        if (monthDifference === 0 && dayDifference < 30) {
            return "Less than a month old";
        } else {
            return `${monthAge === 1 ? "1 month" : monthAge + " months"} old`;
        }
    } else {
        return `${age === 1 ? "1 year" : age + " years"} old`;
    }
}

export function getSizeGroup(size) {
    if (size >= 0 && size <= 24) {
        return "Small";
    } else if (size >= 25 && size <= 59) {
        return "Medium";
    } else if (size >= 60 && size <= 99) {
        return "Large";
    } else if (size >= 100) {
        return "Giant";
    } else {
        return "Unknown";
    }
}
